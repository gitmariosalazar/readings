import { ReadingBillingBreakdownRecorder } from './reading-billing-breakdown-recorder.service';
import { InterfaceReadingBillingBreakdownRepository } from '../../domain/contracts/reading-billing-breakdown.interface.repository';
import { CalculateReadingValueModel } from '../../domain/schemas/model/calculate-reading-value.model';

describe('ReadingBillingBreakdownRecorder', () => {
  const calculation = (withBreakdown: boolean) =>
    new CalculateReadingValueModel({
      cadastralKey: 'k',
      consumption: 12,
      waterConsumptionValue: 10,
      baseRate: 8,
      rateName: 'Residencial',
      sewerageValue: 4,
      others: 1,
      additionalCost: 1,
      fixedRatePerM3: 0.8,
      total: 15,
      breakdown: withBreakdown
        ? {
            water: {
              categoryId: 1,
              tariffName: 'Residencial',
              minRange: 11,
              maxRange: 20,
              appliedBase: 8,
              additionalRatePerM3: 1,
              additionalM3: 2,
              waterAmount: 10,
              formula: '8 + (2 * 1)',
              tariffStructureVersion: null,
            },
            concepts: [
              {
                conceptId: 7,
                amount: 4,
                calculationBase: 10,
                formula: '10 * 0.4',
              },
            ],
          }
        : undefined,
    });

  const setup = () => {
    const repository: jest.Mocked<InterfaceReadingBillingBreakdownRepository> =
      {
        saveBillingBreakdown: jest.fn().mockResolvedValue(undefined),
      };
    return {
      repository,
      recorder: new ReadingBillingBreakdownRecorder(repository),
    };
  };

  beforeEach(() => jest.spyOn(console, 'error').mockImplementation());
  afterEach(() => jest.restoreAllMocks());

  it('persists the breakdown with the saved reading id', async () => {
    const { repository, recorder } = setup();

    await recorder.record(55, calculation(true));

    const [details, water] = repository.saveBillingBreakdown.mock.calls[0];
    expect(details).toEqual([
      expect.objectContaining({ readingId: 55, conceptId: 7, amount: 4 }),
    ]);
    expect(water).toMatchObject({
      readingId: 55,
      categoryId: 1,
      waterAmount: 10,
    });
  });

  it('does nothing when the calculation has no breakdown', async () => {
    const { repository, recorder } = setup();

    await recorder.record(55, calculation(false));

    expect(repository.saveBillingBreakdown).not.toHaveBeenCalled();
  });

  it('does not fail the reading flow when persisting the breakdown fails', async () => {
    const { repository, recorder } = setup();
    repository.saveBillingBreakdown.mockRejectedValueOnce(new Error('db down'));

    await expect(
      recorder.record(55, calculation(true)),
    ).resolves.toBeUndefined();
  });
});
