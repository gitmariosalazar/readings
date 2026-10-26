import { Injectable, Optional, Inject, Logger } from '@nestjs/common';
import {
  ConceptCalculationContext,
  InterfaceConceptCalculationStrategy,
} from '../../../domain/contracts/concept-calculation-strategy.interface';
import { BillingConceptValidity } from '../../../infrastructure/interfaces/sql/reading-sql.result.interface';
import { CalculationConceptBreakdown } from '../../../domain/schemas/model/calculate-reading-value.model';
import { TariffTrashRateCalculator } from './tariff-trash-rate.calculator';
import { InterfaceTrashRateRepository } from '../../../domain/contracts/trash-rate.interface.repository';
import { TrashRateAssignmentModel } from '../../../domain/schemas/model/trash-rate.model';

/**
 * Estrategia de cálculo para el concepto Tasa de Basura (código 'ASEO').
 *
 * Implementa las reglas del Módulo de Tasa de Basura:
 * 1. Si la acometida tiene una asignación fija activa (ej. proveniente de la distribución histórica de EMELNORTE),
 *    aplica ese valor fijo congelado.
 * 2. Si la acometida es nueva o no tiene asignación fija, aplica el pliego tarifario paramétrico
 *    (TariffTrashRateCalculator) según su categoría y consumo en m3.
 * 3. Garantiza en todos los casos el piso mínimo de $1.00 (Regla 4).
 */
@Injectable()
export class TrashConceptStrategy
  implements InterfaceConceptCalculationStrategy
{
  private readonly logger = new Logger(TrashConceptStrategy.name);
  readonly priority = 80; // Prioridad superior a DefaultConceptStrategy (0)
  public static readonly CONCEPT_CODE = 'ASEO';

  constructor(
    @Optional()
    @Inject('TrashRateRepository')
    private readonly trashRateRepository?: InterfaceTrashRateRepository,
  ) {}

  canHandle(concept: BillingConceptValidity): boolean {
    return (
      concept.code === TrashConceptStrategy.CONCEPT_CODE ||
      concept.code?.toUpperCase() === 'TASA_BASURA'
    );
  }

  calculate(
    concept: BillingConceptValidity,
    context: ConceptCalculationContext,
  ): CalculationConceptBreakdown {
    // 1. Caso A: Asignación fija por acometida (Regla 1 - EMELNORTE o congelamiento previo)
    const fixedRateCandidate =
      context.trashRateAssignment?.assignedAmount ??
      context.fixedTrashRate;

    if (fixedRateCandidate != null && Number.isFinite(fixedRateCandidate)) {
      const finalAmount = Math.max(
        Number(fixedRateCandidate),
        TariffTrashRateCalculator.MINIMUM_FLOOR,
      );
      const versionSheet =
        context.trashRateAssignment?.versionSheet ??
        concept.versionSheet ??
        'EMELNORTE-2025-09';

      const origin = context.trashRateAssignment?.origin;
      const formula =
        context.trashRateAssignment?.observation ??
        `Asignación fija${origin ? ` (${origin})` : ''}: $${finalAmount.toFixed(2)} [${versionSheet}]`;

      return {
        conceptId: Number(concept.conceptId),
        amount: Number(finalAmount.toFixed(2)),
        calculationBase: context.consumptionM3 ?? null,
        formula,
        validityConceptId:
          concept.validityConceptId != null
            ? Number(concept.validityConceptId)
            : undefined,
        versionSheet,
      };
    }

    // 2. Caso B: Acometida nueva o sin asignación fija (Reglas 2 y 3)
    const categoryName = context.rateName || '';
    const consumption = context.consumptionM3 ?? 0;

    const calculation = TariffTrashRateCalculator.calculate(
      categoryName,
      consumption,
      context.trashRateConfig,
    );

    const versionSheet =
      calculation.versionSheet || concept.versionSheet || 'TB-V1-2026';

    // Si aún no existe la acometida en acometida_tasa_basura, debe insertarse en la tabla
    if (this.trashRateRepository && context.cadastralKey) {
      const connectionId = context.cadastralKey;
      const clientId = (context as any).clientId || connectionId;

      const assignmentToPersist = new TrashRateAssignmentModel(
        connectionId,
        clientId,
        calculation.amount,
        'TARIFA_NUEVA_ACOMETIDA',
        versionSheet,
        undefined,
        null,
        null,
        null,
        false,
        false,
        true,
        new Date('2026-01-01T00:00:00.000Z'),
        null,
        calculation.formula,
      );

      this.trashRateRepository
        .saveAssignment(assignmentToPersist)
        .then(() => {
          this.logger.log(
            `[TrashConceptStrategy] Acometida "${connectionId}" insertada exitosamente en acometida_tasa_basura ($${calculation.amount})`,
          );
        })
        .catch((err) => {
          this.logger.warn(
            `[TrashConceptStrategy] No se pudo persistir asignación automática de tasa de basura para acometida "${connectionId}": ${err?.message || err}`,
          );
        });
    }

    return {
      conceptId: Number(concept.conceptId),
      amount: calculation.amount,
      calculationBase: calculation.calculationBase,
      formula: calculation.formula,
      validityConceptId:
        concept.validityConceptId != null
          ? Number(concept.validityConceptId)
          : undefined,
      versionSheet,
    };
  }
}
