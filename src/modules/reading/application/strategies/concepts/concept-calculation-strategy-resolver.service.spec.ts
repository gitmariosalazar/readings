import { ConceptCalculationStrategyResolver } from './concept-calculation-strategy-resolver.service';
import { WaterConceptStrategy } from './water-concept.strategy';
import { SewerageConceptStrategy } from './sewerage-concept.strategy';
import { TrashConceptStrategy } from './trash-concept.strategy';
import { PercentageConceptStrategy } from './percentage-concept.strategy';
import { DiscountConceptStrategy } from './discount-concept.strategy';
import { DefaultConceptStrategy } from './default-concept.strategy';
import {
  ConceptCalculationContext,
  InterfaceConceptCalculationStrategy,
} from '../../../domain/contracts/concept-calculation-strategy.interface';
import { BillingConceptValidity } from '../../../infrastructure/interfaces/sql/reading-sql.result.interface';
import { CalculationConceptBreakdown } from '../../../domain/schemas/model/calculate-reading-value.model';

describe('ConceptCalculationStrategyResolver & Strategies (Patrón Strategy)', () => {
  let resolver: ConceptCalculationStrategyResolver;

  const mockWaterCalculation = {
    waterAmount: 10,
    additionalM3: 2,
    appliedBase: 8,
    formula: '8 + (2 * 1)',
  };

  const context: ConceptCalculationContext = {
    consumptionM3: 12,
    waterCalculation: mockWaterCalculation,
    waterVersionSheet: 'RESIDENCIAL-V-2',
  };

  beforeEach(() => {
    resolver = new ConceptCalculationStrategyResolver();
  });

  it('resolves WaterConceptStrategy for concept with code "AGUA"', () => {
    const concept: BillingConceptValidity = {
      conceptId: 1,
      code: 'AGUA',
      name: 'Agua potable',
      description: null,
      defaultValue: 0,
      isActive: true,
      waterPercentage: 0,
      validityConceptId: 101,
      versionSheet: 'AGUA-V-1',
    };

    const strategy = resolver.resolve(concept);
    expect(strategy).toBeInstanceOf(WaterConceptStrategy);

    const breakdown = strategy.calculate(concept, context);
    expect(breakdown).toEqual({
      conceptId: 1,
      amount: 10,
      calculationBase: 8,
      formula: '8 + (2 * 1)',
      validityConceptId: 101,
      versionSheet: 'RESIDENCIAL-V-2',
    });
  });

  it('resolves SewerageConceptStrategy for concept with code "ALCANTARILLADO"', () => {
    const concept: BillingConceptValidity = {
      conceptId: 7,
      code: 'ALCANTARILLADO',
      name: 'Alcantarillado',
      description: null,
      defaultValue: 0,
      isActive: true,
      waterPercentage: 0.4,
      validityConceptId: 102,
      versionSheet: 'ALC-V-2',
    };

    const strategy = resolver.resolve(concept);
    expect(strategy).toBeInstanceOf(SewerageConceptStrategy);

    const breakdown = strategy.calculate(concept, context);
    expect(breakdown).toEqual({
      conceptId: 7,
      amount: 4, // 10 * 0.4
      calculationBase: 10,
      formula: '10 * 0.4',
      validityConceptId: 102,
      versionSheet: 'ALC-V-2',
    });
  });

  it('resolves PercentageConceptStrategy for any other concept with waterPercentage > 0', () => {
    const concept: BillingConceptValidity = {
      conceptId: 20,
      code: 'TASA_AMBIENTAL_PCT',
      name: 'Tasa Ambiental %',
      description: null,
      defaultValue: 0,
      isActive: true,
      waterPercentage: 0.08,
      validityConceptId: 108,
      versionSheet: 'AMB-V-1',
    };

    const strategy = resolver.resolve(concept);
    expect(strategy).toBeInstanceOf(PercentageConceptStrategy);

    const breakdown = strategy.calculate(concept, context);
    expect(breakdown).toEqual({
      conceptId: 20,
      amount: 0.8, // 10 * 0.08
      calculationBase: 10,
      formula: '10 * 0.08',
      validityConceptId: 108,
      versionSheet: 'AMB-V-1',
    });
  });

  it('resolves DiscountConceptStrategy for concepts starting with DESC_', () => {
    const concept: BillingConceptValidity = {
      conceptId: 5,
      code: 'DESC_TERCERA_EDAD_AGUA',
      name: 'Subsidio Tercera Edad',
      description: null,
      defaultValue: 0,
      isActive: true,
      waterPercentage: 0,
      validityConceptId: 105,
      versionSheet: 'DESC-V-1',
    };

    const strategy = resolver.resolve(concept);
    expect(strategy).toBeInstanceOf(DiscountConceptStrategy);
  });

  it('resolves TrashConceptStrategy for concept with code "ASEO"', () => {
    const concept: BillingConceptValidity = {
      conceptId: 3,
      code: 'ASEO',
      name: 'Tasa de Basura',
      description: null,
      defaultValue: 0,
      isActive: true,
      waterPercentage: 0,
      validityConceptId: 103,
      versionSheet: 'ASEO-V-1',
    };

    const strategy = resolver.resolve(concept);
    expect(strategy).toBeInstanceOf(TrashConceptStrategy);
  });

  it('resolves DefaultConceptStrategy as fallback for concepts without dynamic calculation', () => {
    const concept: BillingConceptValidity = {
      conceptId: 9,
      code: 'COMERCIALIZACION',
      name: 'Comercialización',
      description: null,
      defaultValue: 1.25,
      isActive: true,
      waterPercentage: 0,
      validityConceptId: 103,
      versionSheet: 'COM-V-1',
    };

    const strategy = resolver.resolve(concept);
    expect(strategy).toBeInstanceOf(DefaultConceptStrategy);

    const breakdown = strategy.calculate(concept, context);
    expect(breakdown).toEqual({
      conceptId: 9,
      amount: 1.25,
      calculationBase: null,
      formula: '1.25',
      validityConceptId: 103,
      versionSheet: 'COM-V-1',
    });
  });

  it('allows registering a custom strategy at runtime demonstrating OCP compliance', () => {
    // Nueva regla de negocio: Subsidio del 50% de agua para tercera edad
    class SeniorSubsidyStrategy implements InterfaceConceptCalculationStrategy {
      readonly priority = 95; // Mayor que Sewerage y Percentage
      canHandle(c: BillingConceptValidity): boolean {
        return c.code === 'SUBSIDIO_TERCERA_EDAD';
      }
      calculate(c: BillingConceptValidity, ctx: ConceptCalculationContext): CalculationConceptBreakdown {
        const discount = (ctx.waterCalculation?.waterAmount ?? 0) * -0.5;
        return {
          conceptId: Number(c.conceptId),
          amount: discount,
          calculationBase: ctx.waterCalculation?.waterAmount ?? null,
          formula: `-(10 * 0.5)`,
          validityConceptId: Number(c.validityConceptId),
          versionSheet: c.versionSheet ?? null,
        };
      }
    }

    resolver.registerStrategy(new SeniorSubsidyStrategy());

    const subsidyConcept: BillingConceptValidity = {
      conceptId: 99,
      code: 'SUBSIDIO_TERCERA_EDAD',
      name: 'Subsidio Tercera Edad',
      description: null,
      defaultValue: 0,
      isActive: true,
      waterPercentage: 0,
      validityConceptId: 199,
      versionSheet: 'SUB-V-1',
    };

    const resolved = resolver.resolve(subsidyConcept);
    expect(resolved).toBeInstanceOf(SeniorSubsidyStrategy);

    const result = resolver.calculate(subsidyConcept, context);
    expect(result.amount).toBe(-5);
    expect(result.formula).toBe('-(10 * 0.5)');
  });
});
