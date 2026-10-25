import { DatabaseAbstract } from '../../../../../../shared/connections/database/abstract/abstract.database';
import { ReadingBillingBreakdownPostgreSQLPersistence } from './reading-billing-breakdown-postgresql.persistence';
import { ReadingConceptDetailModel } from '../../../../domain/schemas/model/reading-concept-detail.model';
import { ReadingWaterCalculationModel } from '../../../../domain/schemas/model/reading-water-calculation.model';

describe('ReadingBillingBreakdownPostgreSQLPersistence', () => {
  const water = new ReadingWaterCalculationModel({
    readingId: 10,
    categoryId: 1,
    tariffName: 'Residencial',
    minRange: 11,
    maxRange: 20,
    appliedBase: 8,
    additionalRatePerM3: 1,
    additionalM3: 2,
    waterAmount: 10,
    formula: 'f',
    tariffStructureVersion: 'v1',
  });
  const detail = (conceptId: number) =>
    new ReadingConceptDetailModel({
      readingId: 10,
      conceptId,
      amount: 1,
      calculationBase: null,
      formula: null,
    });

  const setup = () => {
    const client = {
      execute: jest.fn().mockResolvedValue({ affectedRows: 1 }),
    };
    const transaction = jest.fn((op) => op(client));
    const db = { transaction } as unknown as DatabaseAbstract;
    return {
      client,
      transaction,
      repo: new ReadingBillingBreakdownPostgreSQLPersistence(db),
    };
  };

  beforeEach(() => jest.spyOn(console, 'error').mockImplementation());
  afterEach(() => jest.restoreAllMocks());

  it('inserts all concepts in one statement and the water calculation in one transaction', async () => {
    const { client, transaction, repo } = setup();

    await repo.saveBillingBreakdown([detail(1), detail(2)], water);

    expect(transaction).toHaveBeenCalledTimes(1);
    expect(client.execute).toHaveBeenCalledTimes(4);
    const [conceptSql, conceptParams] = client.execute.mock.calls[2];
    expect(conceptSql).toContain('detalle_concepto_lectura');
    expect(conceptSql).toContain(
      '($1, $2, $3, $4, $5, $6, $7), ($8, $9, $10, $11, $12, $13, $14)',
    );
    expect(conceptParams).toEqual([
      10, 1, 0, null, 1, null, null, 10, 2, 0, null, 1, null, null,
    ]);
    const [waterSql, waterParams] = client.execute.mock.calls[3];
    expect(waterSql).toContain('lectura_calculo_valor_agua');
    expect(waterParams).toHaveLength(11);
  });

  it('replaces previous rows for this reading cleanly', async () => {
    const { client, repo } = setup();

    await repo.saveBillingBreakdown([detail(1), detail(2)], water);

    const [waterDelete, waterDeleteParams] = client.execute.mock.calls[0];
    expect(waterDelete).toContain(
      'DELETE FROM public.lectura_calculo_valor_agua',
    );
    expect(waterDeleteParams).toEqual([10]);
    const [conceptDelete, conceptDeleteParams] = client.execute.mock.calls[1];
    expect(conceptDelete).toContain(
      'DELETE FROM public.detalle_concepto_lectura WHERE lectura_id = $1;',
    );
    expect(conceptDeleteParams).toEqual([10]);
  });

  it('skips the concept insert when there are no concepts but still cleans previous rows', async () => {
    const { client, repo } = setup();

    await repo.saveBillingBreakdown([], water);

    expect(client.execute).toHaveBeenCalledTimes(3);
    expect(client.execute.mock.calls[0][0]).toContain('DELETE FROM public.lectura_calculo_valor_agua');
    expect(client.execute.mock.calls[1][0]).toContain('DELETE FROM public.detalle_concepto_lectura');
    expect(client.execute.mock.calls[2][0]).toContain('INSERT INTO public.lectura_calculo_valor_agua');
  });

  it('propagates failures so the transaction is rolled back', async () => {
    const { client, repo } = setup();
    client.execute.mockRejectedValueOnce(new Error('fk violation'));

    await expect(repo.saveBillingBreakdown([detail(1)], water)).rejects.toThrow(
      'fk violation',
    );
  });
});
