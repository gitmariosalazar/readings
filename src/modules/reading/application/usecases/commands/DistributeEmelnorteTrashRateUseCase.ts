import { Inject, Injectable, Optional } from '@nestjs/common';
import {
  EmelnorteDistributionItemModel,
  TrashRateAssignmentModel,
} from '../../../domain/schemas/model/trash-rate.model';
import { InterfaceTrashRateRepository } from '../../../domain/contracts/trash-rate.interface.repository';

export interface DistributeEmelnorteTrashRateInput {
  clientId: string;
  septemberTotal: number;
  activeConnectionIds: string[];
  emelnorteQuantity?: number | null;
  persist?: boolean;
}

/**
 * Caso de Uso: Distribución Exacta en Centavos de Tasa de Basura de EMELNORTE.
 *
 * Aplica la Regla 1 del Módulo de Tasa de Basura:
 * - Divide el total de septiembre entre las acometidas activas del cliente.
 * - Garantiza conservación exacta al centavo mediante algoritmo de residuo (penny distribution).
 * - Aplica el piso mínimo de $1.00 por acometida (Regla 4).
 * - Enciende la bandera de auditoría hasCadastralMismatch si la cantidad de medidores
 *   declarados por EMELNORTE no coincide con las acometidas activas en EPAA.
 */
@Injectable()
export class DistributeEmelnorteTrashRateUseCase {
  constructor(
    @Optional()
    @Inject('TrashRateRepository')
    private readonly trashRateRepository?: InterfaceTrashRateRepository,
  ) {}

  async execute(
    input: DistributeEmelnorteTrashRateInput,
  ): Promise<EmelnorteDistributionItemModel[]> {
    const {
      clientId,
      septemberTotal,
      activeConnectionIds,
      emelnorteQuantity,
      persist = false,
    } = input;

    const n = activeConnectionIds?.length ?? 0;
    if (n === 0 || !Number.isFinite(septemberTotal) || septemberTotal <= 0) {
      return [];
    }

    const totalCents = Math.round(septemberTotal * 100);
    const baseCents = Math.floor(totalCents / n);
    const remainderCents = totalCents % n;
    const hasCadastralMismatch =
      emelnorteQuantity != null && emelnorteQuantity !== n;

    const distributionItems: EmelnorteDistributionItemModel[] =
      activeConnectionIds.map((connectionId, index) => {
        const isPennyRemainder = index < remainderCents;
        const finalCents = baseCents + (isPennyRemainder ? 1 : 0);
        const rawAmount = finalCents / 100;
        // Regla 4: Mínimo $1.00
        const assignedAmount = Math.max(rawAmount, 1.0);

        const observation = `Distribución Emelnorte Sep: $${septemberTotal.toFixed(
          2,
        )} entre ${n} acometidas (fila ${index + 1}/${n}). Emelnorte declaró ${
          emelnorteQuantity ?? 'N/D'
        } medidores.${
          isPennyRemainder ? ' Recibe centavo de residuo.' : ''
        }`;

        return {
          connectionId,
          clientId,
          assignedAmount: Number(assignedAmount.toFixed(2)),
          isPennyRemainder,
          hasCadastralMismatch,
          origin: 'EMELNORTE_DISTRIBUCION',
          versionSheet: 'EMELNORTE-2025-09',
          totalClientOrigin: septemberTotal,
          emelnorteQuantityOrigin: emelnorteQuantity ?? null,
          totalActiveConnections: n,
          observation,
        };
      });

    // Si se solicita persistencia y el repositorio está inyectado
    if (persist && this.trashRateRepository) {
      const modelsToSave: TrashRateAssignmentModel[] = distributionItems.map(
        (item) =>
          new TrashRateAssignmentModel(
            item.connectionId,
            item.clientId,
            item.assignedAmount,
            item.origin,
            item.versionSheet,
            undefined,
            item.totalClientOrigin,
            item.emelnorteQuantityOrigin,
            item.totalActiveConnections,
            item.hasCadastralMismatch,
            item.isPennyRemainder,
            true,
            new Date('2026-01-01T00:00:00.000Z'),
            null,
            item.observation,
          ),
      );

      await this.trashRateRepository.saveBatchAssignments(modelsToSave);
    }

    return distributionItems;
  }
}
