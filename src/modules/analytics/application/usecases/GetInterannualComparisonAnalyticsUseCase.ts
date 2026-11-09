import { Inject, Injectable } from '@nestjs/common';
import { InterfaceReadingAnalyticsRepository } from '../../domain/contracts/reading-analytics.interface.repository';
import { InterannualComparisonFilterRequest } from '../dtos/request/interannual-comparison-filter.request';
import { InterannualComparisonResponse } from '../dtos/response/interannual-comparison.response';
import { ReadingAnalyticsMapper } from '../mappers/reading-analytics.mapper';

@Injectable()
export class GetInterannualComparisonAnalyticsUseCase {
  constructor(
    @Inject('ReadingAnalyticsRepository')
    private readonly analyticsRepository: InterfaceReadingAnalyticsRepository,
  ) {}

  async execute(
    request: InterannualComparisonFilterRequest,
  ): Promise<InterannualComparisonResponse[]> {
    const models = await this.analyticsRepository.getInterannualComparison({
      baseYear: request.baseYear,
      targetYear: request.targetYear,
      startMonthNumber: request.startMonthNumber,
      endMonthNumber: request.endMonthNumber,
      sector: request.sector,
      onlyHomologous: request.onlyHomologous,
    });
    return ReadingAnalyticsMapper.toInterannualComparisonResponseList(models);
  }
}
