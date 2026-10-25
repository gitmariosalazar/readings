import { Inject, Injectable, Optional } from '@nestjs/common';
import {
  ConceptCalculationContext,
  InterfaceConceptCalculationStrategy,
} from '../../../domain/contracts/concept-calculation-strategy.interface';
import { BillingConceptValidity } from '../../../infrastructure/interfaces/sql/reading-sql.result.interface';
import { CalculationConceptBreakdown } from '../../../domain/schemas/model/calculate-reading-value.model';
import { WaterConceptStrategy } from './water-concept.strategy';
import { SewerageConceptStrategy } from './sewerage-concept.strategy';
import { PercentageConceptStrategy } from './percentage-concept.strategy';
import { DiscountConceptStrategy } from './discount-concept.strategy';
import { DefaultConceptStrategy } from './default-concept.strategy';

export const CONCEPT_CALCULATION_STRATEGIES = 'CONCEPT_CALCULATION_STRATEGIES';

/**
 * Resolutor de Estrategias para cálculo de conceptos de cobro (Patrón Strategy).
 * Se encarga de seleccionar y delegar el cálculo a la estrategia con mayor prioridad
 * que declare poder procesar el concepto (canHandle).
 */
@Injectable()
export class ConceptCalculationStrategyResolver {
  private readonly strategies: InterfaceConceptCalculationStrategy[];

  constructor(
    @Optional()
    @Inject(CONCEPT_CALCULATION_STRATEGIES)
    injectedStrategies?: InterfaceConceptCalculationStrategy[],
  ) {
    const list =
      injectedStrategies && injectedStrategies.length > 0
        ? injectedStrategies
        : this.getDefaultStrategies();

    this.strategies = [...list].sort((a, b) => b.priority - a.priority);
  }

  /**
   * Resuelve la estrategia adecuada para un concepto específico.
   */
  resolve(concept: BillingConceptValidity): InterfaceConceptCalculationStrategy {
    const strategy = this.strategies.find((s) => s.canHandle(concept));
    if (!strategy) {
      throw new Error(
        `[ConceptCalculationStrategyResolver] No se encontró ninguna estrategia para el concepto con código: "${concept.code}"`,
      );
    }
    return strategy;
  }

  /**
   * Ejecuta el cálculo resolviendo automáticamente la estrategia correspondiente.
   */
  calculate(
    concept: BillingConceptValidity,
    context: ConceptCalculationContext,
  ): CalculationConceptBreakdown {
    const strategy = this.resolve(concept);
    return strategy.calculate(concept, context);
  }

  /**
   * Permite registrar dinámicamente nuevas estrategias en tiempo de ejecución o pruebas.
   */
  registerStrategy(strategy: InterfaceConceptCalculationStrategy): void {
    this.strategies.push(strategy);
    this.strategies.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Estrategias por defecto provistas por la aplicación.
   */
  private getDefaultStrategies(): InterfaceConceptCalculationStrategy[] {
    return [
      new WaterConceptStrategy(),
      new SewerageConceptStrategy(),
      new PercentageConceptStrategy(),
      new DiscountConceptStrategy(),
      new DefaultConceptStrategy(),
    ];
  }
}
