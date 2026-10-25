import { RpcException } from '@nestjs/microservices';
import { RegisterReadingBillingBreakdownUseCase } from './RegisterReadingBillingBreakdownUseCase';
import { InterfaceReadingBillingBreakdownRepository } from '../../../domain/contracts/reading-billing-breakdown.interface.repository';
import { RegisterReadingBillingBreakdownRequest } from '../../dtos/request/register-reading-billing-breakdown.request';

describe('RegisterReadingBillingBreakdownUseCase', () => {
  const buildRequest = (): RegisterReadingBillingBreakdownRequest => ({
    conceptDetails: [
      {
        readingId: 10,
        conceptId: 2,
        amount: 3.2,
        calculationBase: 8,
        formula: '8 * 0.4',
      },
    ],
    waterCalculation: {
      readingId: 10,
      categoryId: 1,
      tariffName: 'Residencial',
      minRange: 11,
      maxRange: 20,
      appliedBase: 8,
      additionalRatePerM3: 1,
      additionalM3: 2,
      waterAmount: 10,
      formula: '8 + 2 * 1',
      tariffStructureVersion: '2024',
    },
  });

  const setup = () => {
    const repository: jest.Mocked<InterfaceReadingBillingBreakdownRepository> =
      {
        saveBillingBreakdown: jest.fn().mockResolvedValue(undefined),
      };
    return {
      repository,
      useCase: new RegisterReadingBillingBreakdownUseCase(repository),
    };
  };

  it('maps the request to models and delegates to the repository', async () => {
    const { repository, useCase } = setup();

    await useCase.execute(buildRequest());

    expect(repository.saveBillingBreakdown).toHaveBeenCalledTimes(1);
    const [details, water] = repository.saveBillingBreakdown.mock.calls[0];
    expect(details).toHaveLength(1);
    expect(details[0]).toMatchObject({
      readingId: 10,
      conceptId: 2,
      amount: 3.2,
    });
    expect(water).toMatchObject({
      readingId: 10,
      categoryId: 1,
      waterAmount: 10,
    });
  });

  it('allows an empty concept list', async () => {
    const { repository, useCase } = setup();
    const request = { ...buildRequest(), conceptDetails: [] };

    await useCase.execute(request);

    expect(repository.saveBillingBreakdown).toHaveBeenCalledWith(
      [],
      expect.objectContaining({ readingId: 10 }),
    );
  });

  it('rejects concept details that belong to a different reading', async () => {
    const { repository, useCase } = setup();
    const request = buildRequest();
    request.conceptDetails[0].readingId = 99;

    await expect(useCase.execute(request)).rejects.toBeInstanceOf(RpcException);
    expect(repository.saveBillingBreakdown).not.toHaveBeenCalled();
  });

  it('rejects invalid amounts and missing water calculation', async () => {
    const { repository, useCase } = setup();
    const invalidAmount = buildRequest();
    invalidAmount.waterCalculation.waterAmount = NaN;

    await expect(useCase.execute(invalidAmount)).rejects.toBeInstanceOf(
      RpcException,
    );
    await expect(
      useCase.execute({ conceptDetails: [] } as any),
    ).rejects.toBeInstanceOf(RpcException);
    expect(repository.saveBillingBreakdown).not.toHaveBeenCalled();
  });
});
