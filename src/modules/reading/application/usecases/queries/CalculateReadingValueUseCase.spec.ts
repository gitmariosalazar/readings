import { CalculateReadingValueUseCase } from './CalculateReadingValueUseCase';
import { InterfaceReadingRepository } from '../../../domain/contracts/reading.interface.repository';
import {
  RateConnectionModel,
  RateRangeModel,
} from '../../../domain/schemas/model/calculate-reading-value.model';
import { ConnectionBenefitModel } from '../../../domain/schemas/model/connection-benefit.model';
import { TrashRateAssignmentModel } from '../../../domain/schemas/model/trash-rate.model';
import { ConceptDeferralModel } from '../../../domain/schemas/model/payment-agreement.model';
import { BillingConceptValidity } from '../../../infrastructure/interfaces/sql/reading-sql.result.interface';

describe('CalculateReadingValueUseCase', () => {
  const cadastralKey = 'connection-1';

  let useCase: CalculateReadingValueUseCase;
  let mockRepository: jest.Mocked<InterfaceReadingRepository>;

  const conceptValidity: BillingConceptValidity[] = [
    {
      conceptId: 1,
      code: 'AGUA',
      name: 'Agua potable',
      description: 'Consumo de agua potable',
      waterPercentage: 0,
      defaultValue: 0,
      isActive: true,
      validityConceptId: 101,
      versionSheet: 'AGUA-V-1',
    },
    {
      conceptId: 7,
      code: 'ALCANTARILLADO',
      name: 'Alcantarillado',
      description: 'Servicio de alcantarillado',
      waterPercentage: 0.4,
      defaultValue: 0,
      isActive: true,
      validityConceptId: 102,
      versionSheet: 'ALCANTARILLADO-V-2',
    },
    {
      conceptId: 9,
      code: 'COMERCIALIZACION',
      name: 'Comercialización',
      description: 'Cargo fijo de comercialización',
      waterPercentage: 0,
      defaultValue: 1,
      isActive: true,
      validityConceptId: 103,
      versionSheet: 'COMERCIALIZACION-V-4',
    },
  ];

  beforeEach(() => {
    mockRepository = {
      findReadingBasicInfo: jest.fn(),
      updateCurrentReading: jest.fn(),
      updateSpecialReading: jest.fn(),
      verifyReadingIfExist: jest.fn(),
      createReading: jest.fn(),
      findReadingInfo: jest.fn(),
      findReadingInfoForUpdated: jest.fn(),
      findReadingHistoryByCadastralKey: jest.fn(),
      getPendingReadingsByMonth: jest.fn(),
      getTakenReadingsByMonth: jest.fn(),
      getTakenReadingEstimatesOrAverage: jest.fn(),
      getReadingByNovelty: jest.fn(),
      getMapGeojsonByDayAndByUser: jest.fn(),
      getDetailedReadingInfoByCadastralKey: jest.fn(),
      generateInitialReadingOnMeterChange: jest.fn(),
      getReadingAdjustmentHistoryByReadingId: jest.fn(),
      getRateConnection: jest.fn(),
      getRateRange: jest.fn(),
      getBillingConceptValidity: jest.fn(),
      getActiveBenefitsByCadastralKey: jest.fn().mockResolvedValue([]),
    };

    useCase = new CalculateReadingValueUseCase(mockRepository);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('adds actual charge components once and excludes per-unit rates from total', async () => {
    mockRepository.getRateConnection.mockResolvedValueOnce(
      new RateConnectionModel(1, 'Residencial'),
    );
    mockRepository.getBillingConceptValidity.mockResolvedValueOnce(
      conceptValidity,
    );
    mockRepository.getRateRange.mockResolvedValueOnce([
      new RateRangeModel(0, 10, 6, 0.5),
      new RateRangeModel(11, 20, 8, 1),
    ]);

    const result = await useCase.execute(cadastralKey, 12);

    expect(result.waterConsumptionValue).toBe(10);
    expect(result.sewerageValue).toBe(4);
    expect(result.others).toBe(1);
    expect(result.additionalCost).toBe(1);
    expect(result.fixedRatePerM3).toBeCloseTo(10 / 12);
    expect(result.total).toBeCloseTo(15);
  });

  it('returns the breakdown needed to persist the water calculation and concepts', async () => {
    mockRepository.getRateConnection.mockResolvedValueOnce(
      new RateConnectionModel(1, 'Residencial'),
    );
    mockRepository.getBillingConceptValidity.mockResolvedValueOnce(
      conceptValidity,
    );
    mockRepository.getRateRange.mockResolvedValueOnce([
      new RateRangeModel(0, 10, 6, 0.5, 'RESIDENCIAL-V-1'),
      new RateRangeModel(11, 20, 8, 1, 'RESIDENCIAL-V-2'),
    ]);

    const result = await useCase.execute(cadastralKey, 12);

    expect(result.breakdown?.water).toEqual({
      categoryId: 1,
      tariffName: 'Residencial',
      minRange: 11,
      maxRange: 20,
      appliedBase: 8,
      additionalRatePerM3: 1,
      additionalM3: 2,
      waterAmount: 10,
      formula: '8 + (2 * 1)',
      tariffStructureVersion: 'RESIDENCIAL-V-2',
    });
    expect(result.breakdown?.concepts).toEqual([
      {
        conceptId: 7,
        amount: 4,
        calculationBase: 10,
        formula: '10 * 0.4',
        validityConceptId: 102,
        versionSheet: 'ALCANTARILLADO-V-2',
      },
      {
        conceptId: 9,
        amount: 1,
        calculationBase: null,
        formula: '1',
        validityConceptId: 103,
        versionSheet: 'COMERCIALIZACION-V-4',
      },
      {
        conceptId: 1,
        amount: 10,
        calculationBase: 8,
        formula: '8 + (2 * 1)',
        validityConceptId: 101,
        versionSheet: 'RESIDENCIAL-V-2', // En agua toma lo que trae findMatchingTariffRange
      },
    ]);
  });

  it('has no breakdown when the consumption is outside any tariff range', async () => {
    mockRepository.getRateConnection.mockResolvedValueOnce(
      new RateConnectionModel(1, 'Residencial'),
    );
    mockRepository.getBillingConceptValidity.mockResolvedValueOnce(
      conceptValidity,
    );
    mockRepository.getRateRange.mockResolvedValueOnce([
      new RateRangeModel(0, 10, 6, 0.5),
    ]);

    const result = await useCase.execute(cadastralKey, 50);

    expect(result.breakdown).toBeUndefined();
    expect(result.rateName).toBe('Residencial');
    expect(result.total).toBe(0);
  });

  it('keeps a valid tariff range whose base rate is zero', async () => {
    mockRepository.getRateConnection.mockResolvedValueOnce(
      new RateConnectionModel(1, 'Residencial'),
    );
    mockRepository.getBillingConceptValidity.mockResolvedValueOnce(
      conceptValidity,
    );
    mockRepository.getRateRange.mockResolvedValueOnce([
      new RateRangeModel(11, 20, 0, 2),
    ]);

    const result = await useCase.execute(cadastralKey, 11);

    expect(result.waterConsumptionValue).toBe(2);
    expect(result.total).toBeCloseTo(3.8);
  });

  it('matches fractional consumption to the tariff interval used by its formula', async () => {
    mockRepository.getRateConnection.mockResolvedValueOnce(
      new RateConnectionModel(1, 'Residencial'),
    );
    mockRepository.getBillingConceptValidity.mockResolvedValueOnce(
      conceptValidity,
    );
    mockRepository.getRateRange.mockResolvedValueOnce([
      new RateRangeModel(0, 10, 6, 0.5),
      new RateRangeModel(11, 20, 8, 1),
    ]);

    const result = await useCase.execute(cadastralKey, 10.5);

    expect(result.waterConsumptionValue).toBe(8.5);
    expect(result.total).toBeCloseTo(12.9);
  });

  it('returns zero charges for non-finite consumption without querying repository', async () => {
    const result = await useCase.execute(cadastralKey, NaN);

    expect(mockRepository.getRateConnection).not.toHaveBeenCalled();
    expect(mockRepository.getBillingConceptValidity).not.toHaveBeenCalled();
    expect(mockRepository.getRateRange).not.toHaveBeenCalled();
    expect(result.total).toBe(0);
    expect(result.others).toBe(0);
  });

  it('returns response DTO mapped correctly in executeCalculateReadingValue', async () => {
    mockRepository.getRateConnection.mockResolvedValueOnce(
      new RateConnectionModel(1, 'Residencial'),
    );
    mockRepository.getBillingConceptValidity.mockResolvedValueOnce(
      conceptValidity,
    );
    mockRepository.getRateRange.mockResolvedValueOnce([
      new RateRangeModel(0, 10, 6, 0.5),
      new RateRangeModel(11, 20, 8, 1),
    ]);

    const response = await useCase.executeCalculateReadingValue(
      cadastralKey,
      12,
    );

    expect(response.cadastralKey).toBe(cadastralKey);
    expect(response.consumption).toBe(12);
    expect(response.waterConsumptionValue).toBe(10);
    expect(response.sewerageValue).toBe(4);
    expect(response.others).toBe(1);
    expect(response.total).toBeCloseTo(15);
  });

  it('inserts all concepts from getBillingConceptValidity without missing any, taking default values when not calculated', async () => {
    const extendedConceptValidity: BillingConceptValidity[] = [
      ...conceptValidity,
      {
        conceptId: 15,
        code: 'BOMBEROS',
        name: 'Tasa bomberos',
        description: 'Tasa para cuerpo de bomberos',
        waterPercentage: 0,
        defaultValue: 0.75,
        isActive: true,
        validityConceptId: 104,
        versionSheet: 'BOMBEROS-V-1',
      },
      {
        conceptId: 16,
        code: 'MEDIO_AMBIENTE',
        name: 'Gestión Ambiental',
        description: 'Tasa ambiental',
        waterPercentage: 0,
        defaultValue: 0.25,
        isActive: true,
        validityConceptId: 105,
        versionSheet: 'AMBIENTAL-V-1',
      },
      {
        conceptId: 17,
        code: 'OTRO_PORCENTUAL',
        name: 'Recargo especial porcentual',
        description: 'Recargo calculado sobre consumo de agua',
        waterPercentage: 0.05,
        defaultValue: 0,
        isActive: true,
        validityConceptId: 106,
        versionSheet: 'PORCENTUAL-V-1',
      },
    ];

    mockRepository.getRateConnection.mockResolvedValueOnce(
      new RateConnectionModel(1, 'Residencial'),
    );
    mockRepository.getBillingConceptValidity.mockResolvedValueOnce(
      extendedConceptValidity,
    );
    mockRepository.getRateRange.mockResolvedValueOnce([
      new RateRangeModel(0, 10, 6, 0.5, 'RESIDENCIAL-V-1'),
      new RateRangeModel(11, 20, 8, 1, 'RESIDENCIAL-V-2'),
    ]);

    const result = await useCase.execute(cadastralKey, 12);

    // Conceptos esperados: ALCANTARILLADO, COMERCIALIZACION, BOMBEROS, MEDIO_AMBIENTE, OTRO_PORCENTUAL, AGUA
    expect(result.breakdown?.concepts).toHaveLength(6);
    expect(result.breakdown?.concepts).toEqual([
      {
        conceptId: 7,
        amount: 4, // 10 * 0.4
        calculationBase: 10,
        formula: '10 * 0.4',
        validityConceptId: 102,
        versionSheet: 'ALCANTARILLADO-V-2',
      },
      {
        conceptId: 9,
        amount: 1, // valor default
        calculationBase: null,
        formula: '1',
        validityConceptId: 103,
        versionSheet: 'COMERCIALIZACION-V-4',
      },
      {
        conceptId: 15,
        amount: 0.75, // valor default
        calculationBase: null,
        formula: '0.75',
        validityConceptId: 104,
        versionSheet: 'BOMBEROS-V-1',
      },
      {
        conceptId: 16,
        amount: 0.25, // valor default
        calculationBase: null,
        formula: '0.25',
        validityConceptId: 105,
        versionSheet: 'AMBIENTAL-V-1',
      },
      {
        conceptId: 17,
        amount: 0.5, // 10 * 0.05 (calculado)
        calculationBase: 10,
        formula: '10 * 0.05',
        validityConceptId: 106,
        versionSheet: 'PORCENTUAL-V-1',
      },
      {
        conceptId: 1,
        amount: 10, // calculado
        calculationBase: 8,
        formula: '8 + (2 * 1)',
        validityConceptId: 101,
        versionSheet: 'RESIDENCIAL-V-2',
      },
    ]);

    // others = COMERCIALIZACION (1) + BOMBEROS (0.75) + MEDIO_AMBIENTE (0.25) + OTRO_PORCENTUAL (0.5) = 2.5
    expect(result.others).toBe(2.5);
    expect(result.waterConsumptionValue).toBe(10);
    expect(result.sewerageValue).toBe(4);
    expect(result.total).toBeCloseTo(16.5);
  });

  it('uses defaultValue for sewerage when waterPercentage is zero or missing', async () => {
    const customConcepts: BillingConceptValidity[] = [
      {
        conceptId: 1,
        code: 'AGUA',
        name: 'Agua potable',
        description: null,
        waterPercentage: 0,
        defaultValue: 0,
        isActive: true,
        validityConceptId: 101,
        versionSheet: 'AGUA-V-1',
      },
      {
        conceptId: 7,
        code: 'ALCANTARILLADO',
        name: 'Alcantarillado tarifa fija',
        description: null,
        waterPercentage: 0,
        defaultValue: 3,
        isActive: true,
        validityConceptId: 102,
        versionSheet: 'ALC-V-1',
      },
    ];

    mockRepository.getRateConnection.mockResolvedValueOnce(
      new RateConnectionModel(1, 'Residencial'),
    );
    mockRepository.getBillingConceptValidity.mockResolvedValueOnce(
      customConcepts,
    );
    mockRepository.getRateRange.mockResolvedValueOnce([
      new RateRangeModel(0, 10, 6, 0.5, 'RESIDENCIAL-V-1'),
    ]);

    const result = await useCase.execute(cadastralKey, 5);

    expect(result.sewerageValue).toBe(3);
    const sewerDetail = result.breakdown?.concepts.find((c) => c.conceptId === 7);
    expect(sewerDetail).toEqual({
      conceptId: 7,
      amount: 3,
      calculationBase: null,
      formula: '3',
      validityConceptId: 102,
      versionSheet: 'ALC-V-1',
    });
  });

  describe('Subsidios y Beneficios Parametrizables (Tercera Edad, Discapacidad, Cruz Roja)', () => {
    const conceptValidityWithDiscounts: BillingConceptValidity[] = [
      ...conceptValidity,
      {
        conceptId: 5,
        code: 'DESC_TERCERA_EDAD_AGUA',
        name: 'Subsidio Tercera Edad - Agua Potable',
        description: 'Descuento del 50% consumo basico agua',
        waterPercentage: 0,
        defaultValue: 0,
        isActive: true,
        validityConceptId: 6,
        versionSheet: 'DESC_TERCERA_EDAD_AGUA-V-6',
      },
      {
        conceptId: 6,
        code: 'DESC_DISCAPACIDAD_AGUA',
        name: 'Subsidio Discapacidad - Agua Potable',
        description: 'Descuento escala CONADIS agua',
        waterPercentage: 0,
        defaultValue: 0,
        isActive: true,
        validityConceptId: 7,
        versionSheet: 'DESC_DISCAPACIDAD_AGUA-V-7',
      },
      {
        conceptId: 11,
        code: 'DESC_CRUZ_ROJA',
        name: 'Convenio Institucional Cruz Roja',
        description: 'Descuento 15% convenio Cruz Roja',
        waterPercentage: 0,
        defaultValue: 0,
        isActive: true,
        validityConceptId: 8,
        versionSheet: 'DESC_CRUZ_ROJA-V-8',
      },
    ];

    const standardTariffRanges = [
      new RateRangeModel(0, 10, 3.7, 0.25, 'RESIDENCIAL-V-1'),
      new RateRangeModel(11, 30, 3.7, 0.25, 'RESIDENCIAL-V-2'),
      new RateRangeModel(31, 50, 8.7, 0.426, 'RESIDENCIAL-V-3'),
    ];

    it('applies Third Age (50% up to 20 m³) and Cruz Roja (15% cumulative) discounts correctly on consumption of 28 m³', async () => {
      // Para 28 m3 en RESIDENCIAL:
      // matchedRange es 11-30: base = 3.70, adic = 0.25
      // additionalM3 = 28 - 10 = 18
      // waterAmount = 3.70 + 18 * 0.25 = 8.20
      // alcantarillado (40%) = 8.20 * 0.40 = 3.28
      // comercialización = 1.00
      //
      // Subsidio 3ra Edad:
      // Tope = 20 m3. Costo primeros 20 m3: 3.70 + 10 * 0.25 = 6.20
      // 50% descuento = -3.10
      //
      // Descuento Cruz Roja:
      // Sin tope. Costo total agua: 8.20
      // 15% descuento = -(8.20 * 0.15) = -1.23
      //
      // Discapacidad: la acometida no tiene discapacidad -> amount 0 (no se incluye en breakdown)
      //
      // others = comercialización (1.00) + (-3.10) + (-1.23) = -3.33
      // total = 8.20 + 3.28 + (-3.33) = 8.15
      const seniorBenefit = new ConnectionBenefitModel(
        'uuid-1',
        cadastralKey,
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
        cadastralKey,
        '1001667532',
        3,
        11,
        'DESC_CRUZ_ROJA',
        'CRUZ_ROJA',
        'Convenio Institucional Cruz Roja',
        'INSTITUCIONAL',
        true,
        15,
        null,
        'V1-CONVENIO',
      );

      mockRepository.getRateConnection.mockResolvedValueOnce(
        new RateConnectionModel(2, 'Residencial'),
      );
      mockRepository.getBillingConceptValidity.mockResolvedValueOnce(
        conceptValidityWithDiscounts,
      );
      mockRepository.getRateRange.mockResolvedValueOnce(standardTariffRanges);
      (
        mockRepository.getActiveBenefitsByCadastralKey as jest.Mock
      ).mockResolvedValueOnce([seniorBenefit, redCrossBenefit]);

      const result = await useCase.execute(cadastralKey, 28);

      expect(result.waterConsumptionValue).toBe(8.2);
      expect(result.sewerageValue).toBe(3.28);
      expect(result.others).toBe(-3.33);
      expect(result.total).toBe(8.15);

      // Verificar que los conceptos del breakdown contienen exactamente los aplicados
      const concepts = result.breakdown?.concepts ?? [];
      const seniorDetail = concepts.find((c) => c.conceptId === 5);
      const redCrossDetail = concepts.find((c) => c.conceptId === 11);
      const disabilityDetail = concepts.find((c) => c.conceptId === 6);

      expect(seniorDetail).toEqual({
        conceptId: 5,
        amount: -3.1,
        calculationBase: 6.2,
        formula: '-(6.20 * 0.5) [Tope 20 m³]',
        validityConceptId: 6,
        versionSheet: 'DESC_TERCERA_EDAD_AGUA-V-V1-2024',
      });

      expect(redCrossDetail).toEqual({
        conceptId: 11,
        amount: -1.23,
        calculationBase: 8.2,
        formula: '-(8.20 * 0.15) [Convenio]',
        validityConceptId: 8,
        versionSheet: 'DESC_CRUZ_ROJA-V-V1-CONVENIO',
      });

      // Discapacidad no aplica -> no figura en el desglose contable
      expect(disabilityDetail).toBeUndefined();
    });

    it('excludes 0-value discount concepts from breakdown when connection has no active benefits', async () => {
      mockRepository.getRateConnection.mockResolvedValueOnce(
        new RateConnectionModel(2, 'Residencial'),
      );
      mockRepository.getBillingConceptValidity.mockResolvedValueOnce(
        conceptValidityWithDiscounts,
      );
      mockRepository.getRateRange.mockResolvedValueOnce(standardTariffRanges);
      (
        mockRepository.getActiveBenefitsByCadastralKey as jest.Mock
      ).mockResolvedValueOnce([]); // Sin beneficios

      const result = await useCase.execute(cadastralKey, 28);

      expect(result.waterConsumptionValue).toBe(8.2);
      expect(result.sewerageValue).toBe(3.28);
      expect(result.others).toBe(1); // Solo comercialización
      expect(result.total).toBe(12.48);

      const concepts = result.breakdown?.concepts ?? [];
      expect(concepts.find((c) => c.conceptId === 5)).toBeUndefined();
      expect(concepts.find((c) => c.conceptId === 6)).toBeUndefined();
      expect(concepts.find((c) => c.conceptId === 11)).toBeUndefined();
    });
  });

  describe('Diferimiento Acumulado por Convenios de Pago', () => {
    it('adds pending deferred balance to regular rate in the next invoice and returns to normal in subsequent cycles', async () => {
      const conceptValidityWithTrash: BillingConceptValidity[] = [
        ...conceptValidity,
        {
          conceptId: 3,
          code: 'ASEO',
          name: 'Tasa de Basura',
          description: null,
          waterPercentage: 0,
          defaultValue: 0,
          isActive: true,
          validityConceptId: 104,
          versionSheet: 'ASEO-V-1',
        },
      ];

      mockRepository.getRateConnection.mockResolvedValueOnce(
        new RateConnectionModel(1, 'Residencial'),
      );
      mockRepository.getBillingConceptValidity.mockResolvedValueOnce(
        conceptValidityWithTrash,
      );
      mockRepository.getRateRange.mockResolvedValueOnce([
        new RateRangeModel(0, 10, 6, 0.5),
      ]);

      // Simulamos que la acometida tiene una asignación fija de $13.13 de EMELNORTE
      mockRepository.getActiveTrashRateByCadastralKey = jest
        .fn()
        .mockResolvedValueOnce(
          new TrashRateAssignmentModel(
            cadastralKey,
            '0200236479001',
            13.13,
            'EMELNORTE_DISTRIBUCION',
            'EMELNORTE-2025-09',
          ),
        );

      // Simulamos saldo diferido pendiente de $39.39 por 3 facturas en convenio
      mockRepository.getPendingConceptDeferrals = jest
        .fn()
        .mockResolvedValueOnce([
          new ConceptDeferralModel(
            cadastralKey,
            3,
            39.39,
            3,
            'PENDIENTE',
            1,
            'ASEO',
          ),
        ]);

      const result = await useCase.execute(cadastralKey, 8);

      const concepts = result.breakdown?.concepts ?? [];
      const aseoDetail = concepts.find((c) => c.conceptId === 3);

      expect(aseoDetail).toBeDefined();
      // 13.13 (mensual normal) + 39.39 (diferido acumulado convenio) = 52.52
      expect(aseoDetail?.amount).toBe(52.52);
      expect(aseoDetail?.formula).toContain('+ Diferido Convenio ($39.39)');
    });
  });
});
