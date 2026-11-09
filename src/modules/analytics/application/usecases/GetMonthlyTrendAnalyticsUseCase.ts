import { Inject, Injectable } from '@nestjs/common';
import { InterfaceReadingAnalyticsRepository } from '../../domain/contracts/reading-analytics.interface.repository';
import { MonthlyTrendFilterRequest } from '../dtos/request/monthly-trend-filter.request';
import { MonthlyTrendResponse } from '../dtos/response/monthly-trend.response';
import { ReadingAnalyticsMapper } from '../mappers/reading-analytics.mapper';

@Injectable()
export class GetMonthlyTrendAnalyticsUseCase {
  constructor(
    @Inject('ReadingAnalyticsRepository')
    private readonly analyticsRepository: InterfaceReadingAnalyticsRepository,
  ) {}

  async execute(
    request: MonthlyTrendFilterRequest,
  ): Promise<MonthlyTrendResponse[]> {
    const models = await this.analyticsRepository.getMonthlyTrend({
      year: request.year,
      startMonth: request.startMonth,
      endMonth: request.endMonth,
      sector: request.sector,
    });
    return ReadingAnalyticsMapper.toMonthlyTrendResponseList(models);
  }
}
