import { Inject, Injectable } from '@nestjs/common';
import { InterfaceReadingAnalyticsRepository } from '../../domain/contracts/reading-analytics.interface.repository';
import { NoveltyEconomicImpactFilterRequest } from '../dtos/request/novelty-economic-impact-filter.request';
import { NoveltyEconomicImpactResponse } from '../dtos/response/novelty-economic-impact.response';
import { ReadingAnalyticsMapper } from '../mappers/reading-analytics.mapper';

@Injectable()
export class GetNoveltyEconomicImpactAnalyticsUseCase {
  constructor(
    @Inject('ReadingAnalyticsRepository')
    private readonly analyticsRepository: InterfaceReadingAnalyticsRepository,
  ) {}

  async execute(
    request: NoveltyEconomicImpactFilterRequest,
  ): Promise<NoveltyEconomicImpactResponse[]> {
    const models = await this.analyticsRepository.getNoveltyEconomicImpact({
      month: request.month,
      sector: request.sector,
    });
    return ReadingAnalyticsMapper.toNoveltyEconomicImpactResponseList(models);
  }
}
