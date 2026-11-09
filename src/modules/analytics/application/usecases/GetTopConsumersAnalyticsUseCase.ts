import { Inject, Injectable } from '@nestjs/common';
import { InterfaceReadingAnalyticsRepository } from '../../domain/contracts/reading-analytics.interface.repository';
import { TopConsumersFilterRequest } from '../dtos/request/top-consumers-filter.request';
import { TopConsumerResponse } from '../dtos/response/top-consumer.response';
import { ReadingAnalyticsMapper } from '../mappers/reading-analytics.mapper';

@Injectable()
export class GetTopConsumersAnalyticsUseCase {
  constructor(
    @Inject('ReadingAnalyticsRepository')
    private readonly analyticsRepository: InterfaceReadingAnalyticsRepository,
  ) {}

  async execute(
    request: TopConsumersFilterRequest,
  ): Promise<TopConsumerResponse[]> {
    const models = await this.analyticsRepository.getTopConsumers({
      month: request.month,
      sector: request.sector,
      limit: request.limit,
      minConsumptionM3: request.minConsumptionM3,
      novelty: request.novelty,
    });
    return ReadingAnalyticsMapper.toTopConsumerResponseList(models);
  }
}
