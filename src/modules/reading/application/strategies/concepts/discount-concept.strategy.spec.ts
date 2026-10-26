import { DiscountConceptStrategy } from './discount-concept.strategy';
import { ConceptCalculationContext } from '../../../domain/contracts/concept-calculation-strategy.interface';
import { BillingConceptValidity } from '../../../infrastructure/interfaces/sql/reading-sql.result.interface';
import { RateRangeModel } from '../../../domain/schemas/model/calculate-reading-value.model';
import { ConnectionBenefitModel } from '../../../domain/schemas/model/connection-benefit.model';

describe('DiscountConceptStrategy (Estrategia de Subsidios y Convenios)', () => {
  let strategy: DiscountConceptStrategy;

  const rateRanges: RateRangeModel[] = [
    new RateRangeModel(0, 10, 3.7, 0.25, 'RESIDENCIAL-V-1'),
    new RateRangeModel(11, 30, 3.7, 0.25, 'RESIDENCIAL-V-2'),
    new RateRangeModel(31, 50, 8.7, 0.426, 'RESIDENCIAL-V-3'),
  ];

  const seniorConcept: BillingConceptValidity = {
    conceptId: 5,
    code: 'DESC_TERCERA_EDAD_AGUA',
    name: 'Subsidio Tercera Edad - Agua Potable',
    description: 'Descuento del 50% consumo basico agua',
    defaultValue: 0,
    isActive: true,
    waterPercentage: 0,
    validityConceptId: 6,
    versionSheet: 'DESC_TERCERA_EDAD_AGUA-V-6',
  };

  const disabilityConcept: BillingConceptValidity = {
    conceptId: 6,
    code: 'DESC_DISCAPACIDAD_AGUA',
    name: 'Subsidio Discapacidad - Agua Potable',
    description: 'Descuento escala CONADIS agua',
    defaultValue: 0,
    isActive: true,
    waterPercentage: 0,
    validityConceptId: 7,
    versionSheet: 'DESC_DISCAPACIDAD_AGUA-V-7',
  };

  const redCrossConcept: BillingConceptValidity = {
    conceptId: 11,
    code: 'DESC_CRUZ_ROJA',
    name: 'Convenio Institucional Cruz Roja',
    description: 'Descuento 15% convenio Cruz Roja',
    defaultValue: 0,
    isActive: true,
    waterPercentage: 0,
    validityConceptId: 8,
    versionSheet: 'DESC_CRUZ_ROJA-V-8',
  };

  beforeEach(() => {
    strategy = new DiscountConceptStrategy();
  });

  describe('canHandle', () => {
    it('returns true for concepts starting with DESC_, SUBSIDIO_ or containing DESCUENTO', () => {
      expect(strategy.canHandle(seniorConcept)).toBe(true);
      expect(strategy.canHandle(disabilityConcept)).toBe(true);
      expect(strategy.canHandle(redCrossConcept)).toBe(true);
      expect(
        strategy.canHandle({
          ...seniorConcept,
          code: 'SUBSIDIO_VULNERABLE',
        }),
      ).toBe(true);
    });

    it('returns false for concepts that are not discounts', () => {
      expect(
        strategy.canHandle({
          conceptId: 1,
          code: 'AGUA',
          name: 'Agua',
          description: null,
          defaultValue: 0,
          isActive: true,
          waterPercentage: 0,
          validityConceptId: 1,
          versionSheet: null,
        }),
      ).toBe(false);
      expect(
        strategy.canHandle({
          conceptId: 2,
          code: 'ALCANTARILLADO',
          name: 'Alcantarillado',
          description: null,
          defaultValue: 0,
          isActive: true,
          waterPercentage: 0.4,
          validityConceptId: 2,
          versionSheet: null,
        }),
      ).toBe(false);
    });
  });

  describe('calculate when connection has NO active benefits', () => {
    it('returns amount 0 and empty formula if connection has no matching benefit', () => {
      const context: ConceptCalculationContext = {
        consumptionM3: 28,
        rateRanges,
        matchedRange: rateRanges[1],
        waterCalculation: {
          waterAmount: 8.2,
          additionalM3: 18,
          appliedBase: 3.7,
          formula: '3.7 + (18 * 0.25)',
        },
        activeBenefits: [], // Sin beneficios
      };

      const result = strategy.calculate(seniorConcept, context);

      expect(result.conceptId).toBe(5);
      expect(result.amount).toBe(0);
      expect(result.calculationBase).toBeNull();
      expect(result.formula).toBe('0');
      expect(result.validityConceptId).toBe(6);
      expect(result.versionSheet).toBe('DESC_TERCERA_EDAD_AGUA-V-6');
    });
  });

  describe('calculate Third Age discount (Tope legal de 20 m³, 50% de descuento)', () => {
    const seniorBenefit = new ConnectionBenefitModel(
      'uuid-1',
      '14-293',
      '1001667532',
      1,
      5,
      'DESC_TERCERA_EDAD_AGUA',
      'TERCERA_EDAD',
      'Subsidio Adulto Mayor (Ley LOPAM)',
      'VULNERABILIDAD',
      false, // No acumulable
      50, // 50%
      20, // Tope 20 m3
      'V1-2024',
      'AGUA',
      false,
    );

    it('calculates 50% discount strictly on the first 20 m³ when consumption is 28 m³ (> 20 m³)', () => {
      // Para 28 m3, waterAmount total es 3.7 + (18 * 0.25) = 8.20
      // Pero para los primeros 20 m3: 3.7 + (10 * 0.25) = 6.20
      // Descuento del 50% sobre 6.20 = 3.10 -> Monto: -3.10
      const context: ConceptCalculationContext = {
        consumptionM3: 28,
        rateRanges,
        matchedRange: rateRanges[1],
        waterCalculation: {
          waterAmount: 8.2,
          additionalM3: 18,
          appliedBase: 3.7,
          formula: '3.7 + (18 * 0.25)',
        },
        activeBenefits: [seniorBenefit],
      };

      const result = strategy.calculate(seniorConcept, context);

      expect(result.conceptId).toBe(5);
      expect(result.amount).toBe(-3.1);
      expect(result.calculationBase).toBe(6.2);
      expect(result.formula).toBe('-(6.20 * 0.5) [Tope 20 m³]');
      expect(result.versionSheet).toBe('DESC_TERCERA_EDAD_AGUA-V-V1-2024');
    });

    it('calculates 50% discount on actual consumption when consumption is 15 m³ (<= 20 m³)', () => {
      // Para 15 m3: 3.7 + (5 * 0.25) = 4.95
      // 50% de 4.95 = 2.475 -> -2.48
      const context: ConceptCalculationContext = {
        consumptionM3: 15,
        rateRanges,
        matchedRange: rateRanges[1],
        waterCalculation: {
          waterAmount: 4.95,
          additionalM3: 5,
          appliedBase: 3.7,
          formula: '3.7 + (5 * 0.25)',
        },
        activeBenefits: [seniorBenefit],
      };

      const result = strategy.calculate(seniorConcept, context);

      expect(result.conceptId).toBe(5);
      expect(result.amount).toBe(-2.48);
      expect(result.calculationBase).toBe(4.95);
      expect(result.formula).toBe('-(4.95 * 0.5) [Tope 20 m³]');
    });

    it('calculates 50% discount on base rate when consumption is within base threshold (<= 10 m³)', () => {
      // Para 8 m3: base es 3.70
      // 50% de 3.70 = 1.85 -> -1.85
      const context: ConceptCalculationContext = {
        consumptionM3: 8,
        rateRanges,
        matchedRange: rateRanges[0],
        waterCalculation: {
          waterAmount: 3.7,
          additionalM3: 0,
          appliedBase: 3.7,
          formula: '3.7',
        },
        activeBenefits: [seniorBenefit],
      };

      const result = strategy.calculate(seniorConcept, context);

      expect(result.conceptId).toBe(5);
      expect(result.amount).toBe(-1.85);
      expect(result.calculationBase).toBe(3.7);
      expect(result.formula).toBe('-(3.70 * 0.5) [Tope 20 m³]');
    });
  });

  describe('calculate Institutional Cruz Roja discount (Sin tope de m³, 15%)', () => {
    const redCrossBenefit = new ConnectionBenefitModel(
      'uuid-2',
      '14-293',
      '1001667532',
      3,
      11,
      'DESC_CRUZ_ROJA',
      'CRUZ_ROJA',
      'Convenio Institucional Cruz Roja',
      'INSTITUCIONAL',
      true, // Acumulable
      15, // 15%
      null, // Sin tope
      'V1-CONVENIO',
      'AGUA',
      false,
    );

    it('applies 15% discount to the full water amount regardless of volume', () => {
      // Para 28 m3, waterAmount es 8.20
      // 15% de 8.20 = 1.23 -> -1.23
      const context: ConceptCalculationContext = {
        consumptionM3: 28,
        rateRanges,
        matchedRange: rateRanges[1],
        waterCalculation: {
          waterAmount: 8.2,
          additionalM3: 18,
          appliedBase: 3.7,
          formula: '3.7 + (18 * 0.25)',
        },
        activeBenefits: [redCrossBenefit],
      };

      const result = strategy.calculate(redCrossConcept, context);

      expect(result.conceptId).toBe(11);
      expect(result.amount).toBe(-1.23);
      expect(result.calculationBase).toBe(8.2);
      expect(result.formula).toBe('-(8.20 * 0.15) [Convenio]');
      expect(result.versionSheet).toBe('DESC_CRUZ_ROJA-V-V1-CONVENIO');
    });
  });

  describe('Mutual Exclusion Rule (Regla de Exclusión Mutua)', () => {
    it('applies only the highest benefit when both Third Age (50%) and Disability (70%) are in activeBenefits', () => {
      const seniorBenefit = new ConnectionBenefitModel(
        'uuid-1',
        '14-293',
        '1001667532',
        1,
        5,
        'DESC_TERCERA_EDAD_AGUA',
        'TERCERA_EDAD',
        'Subsidio Adulto Mayor (Ley LOPAM)',
        'VULNERABILIDAD',
        false, // No acumulable
        50, // 50%
        20,
        'V1-2024',
      );

      const disabilityBenefit = new ConnectionBenefitModel(
        'uuid-3',
        '14-293',
        '1001667532',
        2,
        6,
        'DESC_DISCAPACIDAD_AGUA',
        'DISCAPACIDAD',
        'Subsidio Personas con Discapacidad',
        'VULNERABILIDAD',
        false, // No acumulable
        70, // 70% (Escala CONADIS)
        20,
        'V1-2024',
      );

      const context: ConceptCalculationContext = {
        consumptionM3: 20,
        rateRanges,
        matchedRange: rateRanges[1],
        waterCalculation: {
          waterAmount: 6.2,
          additionalM3: 10,
          appliedBase: 3.7,
          formula: '3.7 + (10 * 0.25)',
        },
        activeBenefits: [seniorBenefit, disabilityBenefit],
      };

      // Discapacidad tiene 70% > 50%, por lo tanto Discapacidad APLICA
      const disabilityResult = strategy.calculate(disabilityConcept, context);
      expect(disabilityResult.amount).toBe(-4.34); // 6.20 * 0.70 = 4.34

      // Tercera Edad tiene 50% < 70%, por lo tanto queda en 0 (excluida)
      const seniorResult = strategy.calculate(seniorConcept, context);
      expect(seniorResult.amount).toBe(0);
      expect(seniorResult.formula).toBe('0');
    });

    it('allows cumulative benefits (Cruz Roja) to coexist with vulnerability benefits (Tercera Edad)', () => {
      const seniorBenefit = new ConnectionBenefitModel(
        'uuid-1',
        '14-293',
        '1001667532',
        1,
        5,
        'DESC_TERCERA_EDAD_AGUA',
        'TERCERA_EDAD',
        'Subsidio Adulto Mayor (Ley LOPAM)',
        'VULNERABILIDAD',
        false,
        50,
        20,
        'V1-2024',
      );

      const redCrossBenefit = new ConnectionBenefitModel(
        'uuid-2',
        '14-293',
        '1001667532',
        3,
        11,
        'DESC_CRUZ_ROJA',
        'CRUZ_ROJA',
        'Convenio Institucional Cruz Roja',
        'INSTITUCIONAL',
        true, // Acumulable
        15,
        null,
        'V1-CONVENIO',
      );

      const context: ConceptCalculationContext = {
        consumptionM3: 20,
        rateRanges,
        matchedRange: rateRanges[1],
        waterCalculation: {
          waterAmount: 6.2,
          additionalM3: 10,
          appliedBase: 3.7,
          formula: '3.7 + (10 * 0.25)',
        },
        activeBenefits: [seniorBenefit, redCrossBenefit],
      };

      // Ambos aplican simultáneamente
      const seniorResult = strategy.calculate(seniorConcept, context);
      expect(seniorResult.amount).toBe(-3.1);

      const redCrossResult = strategy.calculate(redCrossConcept, context);
      expect(redCrossResult.amount).toBe(-0.93); // 6.20 * 0.15 = 0.93
    });

    it('applies only one 50% discount when both Third Age (50%) and Disability (50%) are active in VULNERABILIDAD, even if one has isCumulative = true', () => {
      const seniorBenefit = new ConnectionBenefitModel(
        'uuid-1',
        '10-254',
        '1003426853',
        1,
        5,
        'DESC_TERCERA_EDAD_AGUA',
        'TERCERA_EDAD',
        'Subsidio Adulto Mayor (Ley LOPAM)',
        'VULNERABILIDAD',
        false,
        50,
        20,
        'V1-2024',
      );

      const disabilityBenefit = new ConnectionBenefitModel(
        'uuid-2',
        '10-254',
        '1003426853',
        2,
        6,
        'DESC_DISCAPACIDAD_AGUA',
        'DISCAPACIDAD',
        'Subsidio Personas con Discapacidad',
        'VULNERABILIDAD',
        true, // Even if marked true in table to satisfy partial index
        50,
        20,
        'V1-2024',
      );

      const context: ConceptCalculationContext = {
        consumptionM3: 20,
        rateRanges,
        matchedRange: rateRanges[1],
        waterCalculation: {
          waterAmount: 6.2,
          additionalM3: 10,
          appliedBase: 3.7,
          formula: '3.7 + (10 * 0.25)',
        },
        activeBenefits: [seniorBenefit, disabilityBenefit],
      };

      // Tercera Edad se evalúa primero y aplica 50% (-3.10)
      const seniorResult = strategy.calculate(seniorConcept, context);
      expect(seniorResult.amount).toBe(-3.1);

      // Discapacidad cede el paso por exclusión mutua y queda en 0.00
      const disabilityResult = strategy.calculate(disabilityConcept, context);
      expect(disabilityResult.amount).toBe(0);
      expect(disabilityResult.formula).toBe('0');
    });
  });
});
