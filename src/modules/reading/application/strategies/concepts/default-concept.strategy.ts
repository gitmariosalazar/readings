import { Injectable } from '@nestjs/common';
import {
  ConceptCalculationContext,
  InterfaceConceptCalculationStrategy,
} from '../../../domain/contracts/concept-calculation-strategy.interface';
import { BillingConceptValidity } from '../../../infrastructure/interfaces/sql/reading-sql.result.interface';
import { CalculationConceptBreakdown } from '../../../domain/schemas/model/calculate-reading-value.model';

/**
 * Estrategia por defecto para conceptos fijos o que no tienen cálculo dinámico.
 * Toma el valor por defecto configurado en la vigencia del concepto.
 */
@Injectable()
export class DefaultConceptStrategy implements InterfaceConceptCalculationStrategy {
  readonly priority = 0; // Prioridad más baja (fallback)

  canHandle(_concept: BillingConceptValidity): boolean {
    return true;
  }

  calculate(
    concept: BillingConceptValidity,
    _context: ConceptCalculationContext,
  ): CalculationConceptBreakdown {
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
