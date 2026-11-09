import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetExecutiveDashboardAnalyticsUseCase } from '../../application/usecases/GetExecutiveDashboardAnalyticsUseCase';
import { GetSectorPerformanceAnalyticsUseCase } from '../../application/usecases/GetSectorPerformanceAnalyticsUseCase';
import { GetMonthlyTrendAnalyticsUseCase } from '../../application/usecases/GetMonthlyTrendAnalyticsUseCase';
import { GetNoveltyEconomicImpactAnalyticsUseCase } from '../../application/usecases/GetNoveltyEconomicImpactAnalyticsUseCase';
import { GetTopConsumersAnalyticsUseCase } from '../../application/usecases/GetTopConsumersAnalyticsUseCase';
import { GetInterannualComparisonAnalyticsUseCase } from '../../application/usecases/GetInterannualComparisonAnalyticsUseCase';

import { ExecutiveDashboardFilterRequest } from '../../application/dtos/request/executive-dashboard-filter.request';
import { SectorPerformanceFilterRequest } from '../../application/dtos/request/sector-performance-filter.request';
import { MonthlyTrendFilterRequest } from '../../application/dtos/request/monthly-trend-filter.request';
import { NoveltyEconomicImpactFilterRequest } from '../../application/dtos/request/novelty-economic-impact-filter.request';
import { TopConsumersFilterRequest } from '../../application/dtos/request/top-consumers-filter.request';
import { InterannualComparisonFilterRequest } from '../../application/dtos/request/interannual-comparison-filter.request';

import { ExecutiveDashboardResponse } from '../../application/dtos/response/executive-dashboard.response';
import { SectorPerformanceResponse } from '../../application/dtos/response/sector-performance.response';
import { MonthlyTrendResponse } from '../../application/dtos/response/monthly-trend.response';
import { NoveltyEconomicImpactResponse } from '../../application/dtos/response/novelty-economic-impact.response';
import { TopConsumerResponse } from '../../application/dtos/response/top-consumer.response';
import { InterannualComparisonResponse } from '../../application/dtos/response/interannual-comparison.response';

@Controller()
export class ReadingAnalyticsController {
  constructor(
    private readonly getExecutiveDashboardUseCase: GetExecutiveDashboardAnalyticsUseCase,
    private readonly getSectorPerformanceUseCase: GetSectorPerformanceAnalyticsUseCase,
    private readonly getMonthlyTrendUseCase: GetMonthlyTrendAnalyticsUseCase,
    private readonly getNoveltyEconomicImpactUseCase: GetNoveltyEconomicImpactAnalyticsUseCase,
    private readonly getTopConsumersUseCase: GetTopConsumersAnalyticsUseCase,
    private readonly getInterannualComparisonUseCase: GetInterannualComparisonAnalyticsUseCase,
  ) {}

  @MessagePattern('reading.analytics.executive-dashboard')
  async getExecutiveDashboard(
    @Payload() payload: ExecutiveDashboardFilterRequest | string,
  ): Promise<ExecutiveDashboardResponse> {
    const request: ExecutiveDashboardFilterRequest =
      typeof payload === 'string'
        ? { month: payload.replace(/['"]+/g, '') }
        : payload;
    return this.getExecutiveDashboardUseCase.execute(request);
  }

  @MessagePattern('reading.analytics.sector-performance')
  async getSectorPerformance(
    @Payload() payload: SectorPerformanceFilterRequest | string,
  ): Promise<SectorPerformanceResponse[]> {
    const request: SectorPerformanceFilterRequest =
      typeof payload === 'string'
        ? { month: payload.replace(/['"]+/g, '') }
        : payload;
    return this.getSectorPerformanceUseCase.execute(request);
  }

  @MessagePattern('reading.analytics.monthly-trend')
  async getMonthlyTrend(
    @Payload() payload: MonthlyTrendFilterRequest | number,
  ): Promise<MonthlyTrendResponse[]> {
    const request: MonthlyTrendFilterRequest =
      typeof payload === 'number'
        ? { year: payload }
        : payload ?? {};
    return this.getMonthlyTrendUseCase.execute(request);
  }

  @MessagePattern('reading.analytics.novelty-economic-impact')
  async getNoveltyEconomicImpact(
    @Payload() payload: NoveltyEconomicImpactFilterRequest | string,
  ): Promise<NoveltyEconomicImpactResponse[]> {
    const request: NoveltyEconomicImpactFilterRequest =
      typeof payload === 'string'
        ? { month: payload.replace(/['"]+/g, '') }
        : payload;
    return this.getNoveltyEconomicImpactUseCase.execute(request);
  }

  @MessagePattern('reading.analytics.top-consumers')
  async getTopConsumers(
    @Payload() payload: TopConsumersFilterRequest | string,
  ): Promise<TopConsumerResponse[]> {
    const request: TopConsumersFilterRequest =
      typeof payload === 'string'
        ? { month: payload.replace(/['"]+/g, '') }
        : payload;
    return this.getTopConsumersUseCase.execute(request);
  }

  @MessagePattern('reading.analytics.interannual-comparison')
  async getInterannualComparison(
    @Payload() payload: InterannualComparisonFilterRequest,
  ): Promise<InterannualComparisonResponse[]> {
    return this.getInterannualComparisonUseCase.execute(payload ?? {});
  }
}
