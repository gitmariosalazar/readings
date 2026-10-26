import { BillingConceptValidity } from '../../infrastructure/interfaces/sql/reading-sql.result.interface';
import { CalculationConceptBreakdown, RateRangeModel } from '../schemas/model/calculate-reading-value.model';
import { ConnectionBenefitModel } from '../schemas/model/connection-benefit.model';
import {
  TrashRateAssignmentModel,
  TrashRateCategoryTariffModel,
} from '../schemas/model/trash-rate.model';
import { ConceptDeferralModel } from '../schemas/model/payment-agreement.model';

export interface ConceptCalculationContext {
  consumptionM3: number;
  matchedRange?: RateRangeModel | null;
  rateRanges?: RateRangeModel[];
  rateName?: string;
  categoryId?: number;
  waterCalculation?: {
    waterAmount: number;
    additionalM3: number;
    appliedBase: number;
    formula: string;
  } | null;
  waterVersionSheet?: string | null;
  activeBenefits?: ConnectionBenefitModel[];
  cadastralKey?: string;
  fixedTrashRate?: number | null;
  trashRateAssignment?: TrashRateAssignmentModel | null;
  trashRateConfig?: TrashRateCategoryTariffModel | null;
  pendingDeferrals?: ConceptDeferralModel[];
}

/**
 * Contrato de Dominio para el Patrón Strategy en el cálculo de conceptos de cobro.
 * Permite que nuevos tipos de cálculos se incorporen sin modificar los casos de uso existentes (Principio Open/Closed).
 */
export interface InterfaceConceptCalculationStrategy {
  /**
   * Prioridad de la estrategia. Mayor valor = mayor precedencia al resolver.
   */
  readonly priority: number;

  /**
   * Determina si esta estrategia puede manejar el concepto especificado.
   */
  canHandle(concept: BillingConceptValidity): boolean;

  /**
   * Ejecuta el cálculo del concepto y retorna su desglose para auditoría y persistencia.
   */
  calculate(
    concept: BillingConceptValidity,
    context: ConceptCalculationContext,
  ): CalculationConceptBreakdown;
}
