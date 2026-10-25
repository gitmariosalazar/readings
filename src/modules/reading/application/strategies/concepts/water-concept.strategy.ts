import { Injectable } from '@nestjs/common';
import {
  ConceptCalculationContext,
  InterfaceConceptCalculationStrategy,
} from '../../../domain/contracts/concept-calculation-strategy.interface';
import { BillingConceptValidity } from '../../../infrastructure/interfaces/sql/reading-sql.result.interface';
import { CalculationConceptBreakdown } from '../../../domain/schemas/model/calculate-reading-value.model';

/**
 * Estrategia de cálculo para el concepto de AGUA.
 * Utiliza el cálculo de pliego tarifario escalonado (rango base y adicional por m3).
 */
@Injectable()
export class WaterConceptStrategy implements InterfaceConceptCalculationStrategy {
  private readonly WATER_CONCEPT_CODE = 'AGUA';
  readonly priority = 100;

  canHandle(concept: BillingConceptValidity): boolean {
    return concept.code === this.WATER_CONCEPT_CODE;
  }

  calculate(
    concept: BillingConceptValidity,
    context: ConceptCalculationContext,
  ): CalculationConceptBreakdown {
    if (context.waterCalculation) {
      return {
        conceptId: Number(concept.conceptId),
        amount: context.waterCalculation.waterAmount,
        calculationBase: context.waterCalculation.appliedBase,
        formula: context.waterCalculation.formula,
        validityConceptId:
          concept.validityConceptId != null
            ? Number(concept.validityConceptId)
            : undefined,
        versionSheet: context.waterVersionSheet ?? concept.versionSheet ?? null,
      };
    }

    const defaultVal = Number(concept.defaultValue ?? 0);
    return {
      conceptId: Number(concept.conceptId),
      amount: defaultVal,
      calculationBase: null,
      formula: `${defaultVal}`,
      validityConceptId:
        concept.validityConceptId != null
          ? Number(concept.validityConceptId)
          : undefined,
      versionSheet: concept.versionSheet ?? null,
    };
  }
}
