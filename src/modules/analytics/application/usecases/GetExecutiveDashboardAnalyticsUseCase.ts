import { Inject, Injectable } from '@nestjs/common';
import { InterfaceReadingAnalyticsRepository } from '../../domain/contracts/reading-analytics.interface.repository';
import { ExecutiveDashboardFilterRequest } from '../dtos/request/executive-dashboard-filter.request';
import { ExecutiveDashboardResponse } from '../dtos/response/executive-dashboard.response';
import { ReadingAnalyticsMapper } from '../mappers/reading-analytics.mapper';

@Injectable()
export class GetExecutiveDashboardAnalyticsUseCase {
  constructor(
    @Inject('ReadingAnalyticsRepository')
    private readonly analyticsRepository: InterfaceReadingAnalyticsRepository,
  ) {}

  async execute(
    request: ExecutiveDashboardFilterRequest,
  ): Promise<ExecutiveDashboardResponse> {
    const model = await this.analyticsRepository.getExecutiveDashboard({
      month: request.month,
      sector: request.sector,
    });
    return ReadingAnalyticsMapper.toExecutiveDashboardResponse(model);
  }
}
