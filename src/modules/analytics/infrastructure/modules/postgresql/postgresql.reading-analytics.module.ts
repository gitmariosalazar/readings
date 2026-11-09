import { Module } from '@nestjs/common';
import { ReadingAnalyticsController } from '../../controllers/reading-analytics.controller';
import { ReadingAnalyticsPostgreSQLPersistence } from '../../repositories/postgresql/persistence/reading-analytics-postgresql.persistence';

import { GetExecutiveDashboardAnalyticsUseCase } from '../../../application/usecases/GetExecutiveDashboardAnalyticsUseCase';
import { GetSectorPerformanceAnalyticsUseCase } from '../../../application/usecases/GetSectorPerformanceAnalyticsUseCase';
import { GetMonthlyTrendAnalyticsUseCase } from '../../../application/usecases/GetMonthlyTrendAnalyticsUseCase';
import { GetNoveltyEconomicImpactAnalyticsUseCase } from '../../../application/usecases/GetNoveltyEconomicImpactAnalyticsUseCase';
import { GetTopConsumersAnalyticsUseCase } from '../../../application/usecases/GetTopConsumersAnalyticsUseCase';
import { GetInterannualComparisonAnalyticsUseCase } from '../../../application/usecases/GetInterannualComparisonAnalyticsUseCase';

@Module({
  controllers: [ReadingAnalyticsController],
  providers: [
    GetExecutiveDashboardAnalyticsUseCase,
    GetSectorPerformanceAnalyticsUseCase,
    GetMonthlyTrendAnalyticsUseCase,
    GetNoveltyEconomicImpactAnalyticsUseCase,
    GetTopConsumersAnalyticsUseCase,
    GetInterannualComparisonAnalyticsUseCase,
    {
      provide: 'ReadingAnalyticsRepository',
      useClass: ReadingAnalyticsPostgreSQLPersistence,
    },
  ],
  exports: [
    GetExecutiveDashboardAnalyticsUseCase,
    GetSectorPerformanceAnalyticsUseCase,
    GetMonthlyTrendAnalyticsUseCase,
    GetNoveltyEconomicImpactAnalyticsUseCase,
    GetTopConsumersAnalyticsUseCase,
    GetInterannualComparisonAnalyticsUseCase,
    'ReadingAnalyticsRepository',
  ],
})
export class ReadingAnalyticsModuleUsingPostgreSQL {}
