import { DatabaseAbstract } from '../../../../../../shared/connections/database/abstract/abstract.database';
import { ReadingPersistencePostgreSQL } from './reading-postgresql.persistence';

describe('ReadingPersistencePostgreSQL', () => {
  const cadastralKey = 'connection-1';

  const createRepository = (query: jest.Mock) => {
    const databaseService = {
      connect: jest.fn(),
      query,
      execute: jest.fn(),
      transaction: jest.fn(),
      getClient: jest.fn(),
      close: jest.fn(),
    } as unknown as DatabaseAbstract;

    return new ReadingPersistencePostgreSQL(databaseService);
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getRateConnection', () => {
    it('returns the category id and name for a cadastral key', async () => {
      const mockResult = [{ categoryId: 1, categoryName: 'Residencial' }];
      const query = jest.fn().mockResolvedValueOnce(mockResult);
      const repository = createRepository(query);

      const result = await repository.getRateConnection(cadastralKey);

      expect(query).toHaveBeenCalledWith(expect.any(String), [cadastralKey]);
      expect(result).toEqual(mockResult[0]);
    });
  });

  describe('getRateRange', () => {
    it('returns the tariff ranges for a category id ordered by min', async () => {
      const mockRanges = [
        { min: 0, max: 10, base: 6, additional: 0.5 },
        { min: 11, max: 20, base: 8, additional: 1 },
      ];
      const query = jest.fn().mockResolvedValueOnce(mockRanges);
      const repository = createRepository(query);

      const result = await repository.getRateRange(1);

      expect(query).toHaveBeenCalledWith(expect.any(String), [1]);
      expect(result).toEqual(mockRanges);
    });
  });

  describe('getBillingConceptValidity', () => {
    it('returns active billing concepts validity', async () => {
      const mockConcepts = [
        {
          conceptId: 1,
          code: 'ALCANTARILLADO',
          name: 'Alcantarillado',
          description: 'Saneamiento',
          defaultValue: 0,
          isActive: true,
          waterPercentage: 0.4,
        },
      ];
      const query = jest.fn().mockResolvedValueOnce(mockConcepts);
      const repository = createRepository(query);

      const result = await repository.getBillingConceptValidity();

      expect(query).toHaveBeenCalledWith(expect.any(String), []);
      expect(result).toEqual(mockConcepts);
    });
  });

  describe('getActiveBenefitsByCadastralKey', () => {
    it('returns mapped active benefits for a cadastral key', async () => {
      const mockSqlResult = [
        {
          id: 'uuid-1',
          connectionId: '14-293',
          clientId: '1001667532',
          benefitTypeId: 1,
          conceptId: 5,
          conceptCode: 'DESC_TERCERA_EDAD_AGUA',
          benefitTypeCode: 'TERCERA_EDAD',
          benefitTypeName: 'Subsidio Adulto Mayor',
          benefitGroup: 'VULNERABILIDAD',
          isCumulative: false,
          porcentaje_descuento_efectivo: '50.00',
          limite_m3_subsidio: '20.00',
          codigo_version: 'V1-2024',
          aplica_sobre_concepto: 'AGUA',
          subsidia_alcantarillado: false,
          porcentaje_discapacidad: null,
        },
      ];
      const query = jest.fn().mockResolvedValueOnce(mockSqlResult);
      const repository = createRepository(query);

      const result = await repository.getActiveBenefitsByCadastralKey('14-293');

      expect(query).toHaveBeenCalledWith(expect.any(String), ['14-293']);
      expect(result).toHaveLength(1);
      expect(result[0].conceptCode).toBe('DESC_TERCERA_EDAD_AGUA');
      expect(result[0].effectivePercentage).toBe(50);
      expect(result[0].m3Limit).toBe(20);
      expect(result[0].isCumulative).toBe(false);
    });
  });

  describe('getMovileWorkPackConnections', () => {
    const mockRow = {
      reading_id: 1,
      previous_reading_date: new Date(),
      reading_time: new Date(),
      reading_date: new Date(),
      cadastral_key: '0101-001',
      card_id: '1001',
      client_name: 'Juan Perez',
      client_phones: [],
      client_emails: [],
      address: 'Calle 1',
      previous_reading: 10,
      current_reading: 20,
      reading_value: 10,
      sector: 2,
      account: 123,
      average_consumption: 15,
      average_value: 12,
      meter_number: 'M-123',
      rate_id: 1,
      rate_name: 'Residencial',
      has_current_reading: false,
      month_reading: '2026-08',
      start_date_period: new Date(),
      end_date_period: new Date(),
      connection_state_id: 1,
      connection_state_name: 'Activo',
      permit_reading: true,
      connection_location: null,
      has_facade: false,
    };

    it('filters correctly when sector is provided', async () => {
      const query = jest.fn().mockResolvedValueOnce([mockRow]);
      const repository = createRepository(query);

      const result = await repository.getMovileWorkPackConnections({ sector: 2 });

      expect(query).toHaveBeenCalledWith(expect.any(String), [null, 2]);
      expect(result).toHaveLength(1);
      expect(result[0].sector).toBe(2);
    });

    it('filters correctly when cadastralKeys are provided', async () => {
      const query = jest.fn().mockResolvedValueOnce([mockRow]);
      const repository = createRepository(query);

      const result = await repository.getMovileWorkPackConnections({
        cadastralKeys: ['0101-001'],
      });

      expect(query).toHaveBeenCalledWith(expect.any(String), [['0101-001'], null]);
      expect(result).toHaveLength(1);
      expect(result[0].cadastralKey).toBe('0101-001');
    });

    it('filters correctly when both sector and cadastralKeys are provided', async () => {
      const query = jest.fn().mockResolvedValueOnce([mockRow]);
      const repository = createRepository(query);

      const result = await repository.getMovileWorkPackConnections({
        sector: 2,
        cadastralKeys: ['0101-001'],
      });

      expect(query).toHaveBeenCalledWith(expect.any(String), [['0101-001'], 2]);
      expect(result).toHaveLength(1);
    });

    it('operates in global mode when no filters are provided', async () => {
      const query = jest.fn().mockResolvedValueOnce([mockRow]);
      const repository = createRepository(query);

      const result = await repository.getMovileWorkPackConnections();

      expect(query).toHaveBeenCalledWith(expect.any(String), [null, null]);
      expect(result).toHaveLength(1);
    });

    it('throws RpcException when no results are found', async () => {
      const query = jest.fn().mockResolvedValueOnce([]);
      const repository = createRepository(query);

      await expect(
        repository.getMovileWorkPackConnections({ sector: 99 }),
      ).rejects.toThrow();
    });
  });
});
