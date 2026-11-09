import { ExecutiveDashboardModel } from '../schemas/model/executive-dashboard.model';
import { SectorPerformanceModel } from '../schemas/model/sector-performance.model';
import { MonthlyTrendModel } from '../schemas/model/monthly-trend.model';
import { NoveltyEconomicImpactModel } from '../schemas/model/novelty-economic-impact.model';
import { TopConsumerModel } from '../schemas/model/top-consumer.model';
import { InterannualComparisonModel } from '../schemas/model/interannual-comparison.model';

export interface ExecutiveDashboardFilter {
  month: string;
  sector?: number;
}

export interface SectorPerformanceFilter {
  month: string;
  sector?: number;
  sortBy?: 'revenue' | 'volume' | 'readings' | 'sector';
}

export interface MonthlyTrendFilter {
  year?: number;
  startMonth?: string;
  endMonth?: string;
  sector?: number;
}

export interface NoveltyEconomicImpactFilter {
  month: string;
  sector?: number;
}

export interface TopConsumersFilter {
  month: string;
  sector?: number;
  limit?: number;
  minConsumptionM3?: number;
  novelty?: string;
}

export interface InterannualComparisonFilter {
  baseYear?: number;
  targetYear?: number;
  startMonthNumber?: number;
  endMonthNumber?: number;
  sector?: number;
  onlyHomologous?: boolean;
}

export interface InterfaceReadingAnalyticsRepository {
  getExecutiveDashboard(filter: ExecutiveDashboardFilter): Promise<ExecutiveDashboardModel>;
  getSectorPerformance(filter: SectorPerformanceFilter): Promise<SectorPerformanceModel[]>;
  getMonthlyTrend(filter: MonthlyTrendFilter): Promise<MonthlyTrendModel[]>;
  getNoveltyEconomicImpact(filter: NoveltyEconomicImpactFilter): Promise<NoveltyEconomicImpactModel[]>;
  getTopConsumers(filter: TopConsumersFilter): Promise<TopConsumerModel[]>;
  getInterannualComparison(filter: InterannualComparisonFilter): Promise<InterannualComparisonModel[]>;
}
