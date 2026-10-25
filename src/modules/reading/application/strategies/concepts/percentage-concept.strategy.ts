import { Injectable } from '@nestjs/common';
import {
  ConceptCalculationContext,
  InterfaceConceptCalculationStrategy,
} from '../../../domain/contracts/concept-calculation-strategy.interface';
import { BillingConceptValidity } from '../../../infrastructure/interfaces/sql/reading-sql.result.interface';
import { CalculationConceptBreakdown } from '../../../domain/schemas/model/calculate-reading-value.model';

/**
 * Estrategia para conceptos cuyo cálculo es un porcentaje sobre el valor del consumo de agua.
 */
@Injectable()
export class PercentageConceptStrategy implements InterfaceConceptCalculationStrategy {
  readonly priority = 50;

  canHandle(concept: BillingConceptValidity): boolean {
    return Number(concept.waterPercentage ?? 0) > 0;
  }

  calculate(
    concept: BillingConceptValidity,
    context: ConceptCalculationContext,
  ): CalculationConceptBreakdown {
    const waterPct = Number(concept.waterPercentage ?? 0);
    const waterAmount = context.waterCalculation?.waterAmount ?? 0;

    if (context.waterCalculation && waterPct > 0) {
      const amount = Number((waterAmount * waterPct).toFixed(2));
      return {
        conceptId: Number(concept.conceptId),
        amount,
        calculationBase: waterAmount,
        formula: `${waterAmount} * ${waterPct}`,
        validityConceptId:
          concept.validityConceptId != null
            ? Number(concept.validityConceptId)
            : undefined,
        versionSheet: concept.versionSheet ?? null,
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
