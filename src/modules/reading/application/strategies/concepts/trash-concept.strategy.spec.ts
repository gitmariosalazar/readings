import { TrashConceptStrategy } from './trash-concept.strategy';
import { BillingConceptValidity } from '../../../infrastructure/interfaces/sql/reading-sql.result.interface';
import { ConceptCalculationContext } from '../../../domain/contracts/concept-calculation-strategy.interface';
import { TrashRateAssignmentModel } from '../../../domain/schemas/model/trash-rate.model';
import { InterfaceTrashRateRepository } from '../../../domain/contracts/trash-rate.interface.repository';

describe('TrashConceptStrategy (Estrategia de Dominio para Concepto "ASEO")', () => {
  let strategy: TrashConceptStrategy;
  let mockRepository: jest.Mocked<InterfaceTrashRateRepository>;

  const conceptAseo: BillingConceptValidity = {
    conceptId: 3,
    code: 'ASEO',
    name: 'Tasa de recolección de Basura',
    description: null,
    defaultValue: 0,
    isActive: true,
    waterPercentage: 0,
    validityConceptId: 103,
    versionSheet: 'ASEO-V-1',
  };

  beforeEach(() => {
    mockRepository = {
      findActiveAssignmentByConnection: jest.fn(),
      findActiveCategoryTariff: jest.fn(),
      saveAssignment: jest.fn().mockResolvedValue(undefined),
      saveBatchAssignments: jest.fn().mockResolvedValue(undefined),
      getEmelnorteData: jest.fn(),
      getActiveConnectionsByClientId: jest.fn(),
      findClientIdByConnectionId: jest.fn(),
    };
    strategy = new TrashConceptStrategy(mockRepository);
  });

  it('declares priority = 80 and handles "ASEO" concept code', () => {
    expect(strategy.priority).toBe(80);
    expect(strategy.canHandle(conceptAseo)).toBe(true);

    const otherConcept: BillingConceptValidity = {
      ...conceptAseo,
      code: 'ALCANTARILLADO',
    };
    expect(strategy.canHandle(otherConcept)).toBe(false);
  });

  it('applies pre-assigned fixed rate from EMELNORTE when available in context (Regla 1)', () => {
    const context: ConceptCalculationContext = {
      consumptionM3: 15,
      rateName: 'RESIDENCIAL',
      fixedTrashRate: 13.13,
      trashRateAssignment: new TrashRateAssignmentModel(
        '22-492',
        '0200236479001',
        13.13,
        'EMELNORTE_DISTRIBUCION',
        'EMELNORTE-2025-09',
        1,
        39.38,
        4,
        3,
        true,
        true,
        true,
      ),
    };

    const breakdown = strategy.calculate(conceptAseo, context);
    expect(breakdown.conceptId).toBe(3);
    expect(breakdown.amount).toBe(13.13);
    expect(breakdown.versionSheet).toBe('EMELNORTE-2025-09');
    expect(breakdown.formula).toContain('13.13');
    expect(mockRepository.saveAssignment).not.toHaveBeenCalled();
  });

  it('calculates fallback tariff for new or unassigned COMERCIAL connection (Regla 2 & 3)', () => {
    const context: ConceptCalculationContext = {
      consumptionM3: 20,
      rateName: 'COMERCIAL',
      cadastralKey: '22-999',
    };

    const breakdown = strategy.calculate(conceptAseo, context);
    expect(breakdown.conceptId).toBe(3);
    expect(breakdown.amount).toBe(20.44);
    expect(breakdown.formula).toContain('Tarifa fija COMERCIAL: $20.44');
    expect(mockRepository.saveAssignment).toHaveBeenCalledWith(
      expect.objectContaining({
        connectionId: '22-999',
        assignedAmount: 20.44,
        origin: 'TARIFA_NUEVA_ACOMETIDA',
      }),
    );
  });

  it('calculates fallback tariff for new or unassigned RESIDENCIAL connection based on consumption (Regla 2 & 3)', () => {
    const context: ConceptCalculationContext = {
      consumptionM3: 35,
      rateName: 'RESIDENCIAL',
      cadastralKey: '22-888',
    };

    const breakdown = strategy.calculate(conceptAseo, context);
    expect(breakdown.conceptId).toBe(3);
    // 31 - 50 m3 -> $4.66
    expect(breakdown.amount).toBe(4.66);
    expect(breakdown.formula).toContain('35 m3: $4.66');
    expect(mockRepository.saveAssignment).toHaveBeenCalledWith(
      expect.objectContaining({
        connectionId: '22-888',
        assignedAmount: 4.66,
      }),
    );
  });

  it('enforces floor of $1.00 when pre-assigned or calculated value is lower (Regla 4)', () => {
    const context: ConceptCalculationContext = {
      consumptionM3: 5,
      rateName: 'DESCONOCIDA', // da $0.00 en calculador
    };

    const breakdown = strategy.calculate(conceptAseo, context);
    expect(breakdown.amount).toBe(1.0);
  });
});
