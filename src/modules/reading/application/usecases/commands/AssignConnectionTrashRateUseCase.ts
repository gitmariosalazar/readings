import { Inject, Injectable, Logger, Optional } from '@nestjs/common';
import {
  TrashRateAssignmentModel,
  TrashRateOrigin,
} from '../../../domain/schemas/model/trash-rate.model';
import { InterfaceTrashRateRepository } from '../../../domain/contracts/trash-rate.interface.repository';
import { TariffTrashRateCalculator } from '../../strategies/concepts/tariff-trash-rate.calculator';

export interface AssignConnectionTrashRateInput {
  connectionId: string;
  clientId?: string;
  categoryName: string;
  consumptionM3?: number;
  origin?: TrashRateOrigin;
  versionSheet?: string;
  persist?: boolean;
}

/**
 * Caso de Uso: Asignación Individual de Tasa de Basura para Acometida Nueva o Reactivada.
 *
 * Aplica Clean Architecture y Principios SOLID:
 * - SRP: Responsabilidad única de coordinar la resolución y persistencia de tasa de basura por acometida.
 * - OCP: Extensible a nuevas versiones de pliegos y fuentes de datos sin alterar la orquestación.
 * - LSP: Sustituible con cualquier implementación de InterfaceTrashRateRepository.
 * - ISP: Depende exclusivamente de los métodos del contrato de repositorio de tasa de basura.
 * - DIP: Inyección de dependencias desacoplada mediante la abstracción InterfaceTrashRateRepository.
 *
 * Reglas de Negocio (Módulo de Tasa de Basura):
 * 1. Si la acometida YA EXISTE en acometida_tasa_basura con asignación activa:
 *    Respeta la inmutabilidad de la asignación previa (valor congelado, Reglas 1 y 2).
 *    Retorna el registro existente sin sobreescribirlo ni alterarlo.
 * 2. Si la acometida AÚN NO EXISTE en acometida_tasa_basura:
 *    Calcula la tarifa según categoría y consumo mediante el pliego tarifario paramétrico.
 *    Garantiza el piso mínimo de $1.00 (Regla 4).
 *    Inserta el nuevo registro en la tabla acometida_tasa_basura asociándolo primariamente a la acometida.
 */
@Injectable()
export class AssignConnectionTrashRateUseCase {
  private readonly logger = new Logger(AssignConnectionTrashRateUseCase.name);
  private static readonly OFFICIAL_START_DATE = '2026-01-01T00:00:00.000Z';
  private static readonly DEFAULT_VERSION_SHEET = 'TB-V1-2026';

  constructor(
    @Optional()
    @Inject('TrashRateRepository')
    private readonly trashRateRepository?: InterfaceTrashRateRepository,
  ) {}

  async execute(
    input: AssignConnectionTrashRateInput,
  ): Promise<TrashRateAssignmentModel> {
    const {
      connectionId,
      clientId,
      categoryName,
      consumptionM3 = 0,
      origin = 'TARIFA_NUEVA_ACOMETIDA',
      versionSheet,
      persist = true,
    } = input;

    // 1. Verificar si la acometida ya cuenta con una asignación activa en acometida_tasa_basura
    if (this.trashRateRepository) {
      const existingAssignment =
        await this.trashRateRepository.findActiveAssignmentByConnection(
          connectionId,
        );

      if (existingAssignment) {
        this.logger.log(
          `[AssignConnectionTrashRateUseCase] Acometida "${connectionId}" ya cuenta con asignación activa ($${existingAssignment.assignedAmount} - ${existingAssignment.origin}). Se conserva valor congelado.`,
        );
        return existingAssignment;
      }
    }

    // 2. Resolver clientId si no fue provisto o está vacío
    let resolvedClientId = clientId?.trim() || '';
    if (
      !resolvedClientId &&
      this.trashRateRepository?.findClientIdByConnectionId
    ) {
      const foundClientId =
        await this.trashRateRepository.findClientIdByConnectionId(connectionId);
      if (foundClientId) {
        resolvedClientId = foundClientId;
      }
    }
    if (!resolvedClientId) {
      resolvedClientId = connectionId;
    }

    // 3. Evaluar el pliego tarifario paramétrico según categoría y consumo (Reglas 2, 3 y 4)
    let tariffConfig = null;
    if (this.trashRateRepository) {
      // Intentar obtener configuración de tarifa por categoría si estuviera parametrizada
      // TariffTrashRateCalculator resuelve rangos y tarifas con fallback seguro
    }

    const calculation = TariffTrashRateCalculator.calculate(
      categoryName,
      consumptionM3,
      tariffConfig,
    );

    const targetVersionSheet =
      versionSheet ||
      calculation.versionSheet ||
      AssignConnectionTrashRateUseCase.DEFAULT_VERSION_SHEET;

    const assignment = new TrashRateAssignmentModel(
      connectionId,
      resolvedClientId,
      calculation.amount,
      origin,
      targetVersionSheet,
      undefined,
      null,
      null,
      null,
      false,
      false,
      true,
      new Date(AssignConnectionTrashRateUseCase.OFFICIAL_START_DATE),
      null,
      calculation.formula,
    );

    // 4. Si aún no existe la acometida en acometida_tasa_basura, DEBE INSERTARSE en la tabla
    if (persist && this.trashRateRepository) {
      this.logger.log(
        `[AssignConnectionTrashRateUseCase] Acometida "${connectionId}" no registrada previamente. Insertando en acometida_tasa_basura con valor: $${assignment.assignedAmount} (${assignment.origin})`,
      );
      await this.trashRateRepository.saveAssignment(assignment);
    }

    return assignment;
  }
}
