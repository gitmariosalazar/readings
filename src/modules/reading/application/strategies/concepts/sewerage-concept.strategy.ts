import { Injectable } from '@nestjs/common';
import {
  ConceptCalculationContext,
  InterfaceConceptCalculationStrategy,
} from '../../../domain/contracts/concept-calculation-strategy.interface';
import { BillingConceptValidity } from '../../../infrastructure/interfaces/sql/reading-sql.result.interface';
import { CalculationConceptBreakdown } from '../../../domain/schemas/model/calculate-reading-value.model';

/**
 * Estrategia de cálculo para el concepto de ALCANTARILLADO.
 * Aplica el porcentaje de agua sobre el valor facturado de agua potable, o su valor por defecto si no tiene porcentaje.
 */
@Injectable()
export class SewerageConceptStrategy implements InterfaceConceptCalculationStrategy {
  private readonly SEWERAGE_CONCEPT_CODE = 'ALCANTARILLADO';
  readonly priority = 90;

  canHandle(concept: BillingConceptValidity): boolean {
    return concept.code === this.SEWERAGE_CONCEPT_CODE;
  }

  calculate(
    concept: BillingConceptValidity,
    context: ConceptCalculationContext,
  ): CalculationConceptBreakdown {
    const seweragePercentage = Number(concept.waterPercentage ?? 0);
    const waterAmount = context.waterCalculation?.waterAmount ?? 0;

    if (context.waterCalculation && seweragePercentage > 0) {
      const amount = Number((waterAmount * seweragePercentage).toFixed(2));
      return {
        conceptId: Number(concept.conceptId),
        amount,
        calculationBase: waterAmount,
        formula: `${waterAmount} * ${seweragePercentage}`,
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
