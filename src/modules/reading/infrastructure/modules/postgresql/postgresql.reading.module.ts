import { Get, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ReadingController } from '../../controllers/readings.controller';
import { ReadingPersistencePostgreSQL } from '../../repositories/postgresql/persistence/reading-postgresql.persistence';
import { ReadingImagesPersistencePostgreSQL } from '../../repositories/postgresql/persistence/reading-images-postgresql.persistence';
import { environments } from '../../../../../settings/environments/environments';
import { ObservationReadingPostgreSQLPersistence } from '../../../../observations/infrastructure/repositories/postgresql/persistence/postgresql.observation-reading.persistence';

import { CreateReadingUseCase } from '../../../application/usecases/commands/CreateReadingUseCase';
import { UpdateReadingUseCase } from '../../../application/usecases/commands/UpdateReadingUseCase';
import { FindReadingUseCase } from '../../../application/usecases/queries/FindReadingUseCase';
import { FindBasicReadingUseCase } from '../../../application/usecases/queries/FindBasicReadingUseCase';

import { ReadingReportController } from '../../controllers/reading-report.controller';
import { ReadingImagesController } from '../../controllers/reading-images.controller';
import { ReadingReportPostgreSQLPersistence } from '../../repositories/postgresql/persistence/reading-report-postgresql.persistence';
import { GetConnectionLastReadingsReportUseCase } from '../../../application/usecases/reports/GetConnectionLastReadingsReportUseCase';
import { GetDailyReadingsReportUseCase } from '../../../application/usecases/reports/GetDailyReadingsReportUseCase';
import { GetYearlyReadingsReportUseCase } from '../../../application/usecases/reports/GetYearlyReadingsReportUseCase';
import { GetDashboardMetricsUseCase } from '../../../application/usecases/dashboard/GetDashboardMetricsUseCase';
import { GetGlobalStatsReportUseCase } from '../../../application/usecases/reports/GetGlobalStatsReportUseCase';
import { GetDailyStatsReportUseCase } from '../../../application/usecases/reports/GetDailyStatsReportUseCase';
import { GetSectorStatsReportUseCase } from '../../../application/usecases/reports/GetSectorStatsReportUseCase';
import { GetNoveltyStatsReportUseCase } from '../../../application/usecases/reports/GetNoveltyStatsReportUseCase';
import { GetAdvancedReportReadingsUseCase } from '../../../application/usecases/reports/GetAdvancedReportReadingsUseCase';
import { FindReadingHistoryByCadastralKeyUseCase } from '../../../application/usecases/queries/FindReadingHistoryByCadastralKeyUseCase';
import { GetAllReadingImagesUseCase } from '../../../application/usecases/queries/GetAllReadingImagesUseCase';
import { FindReadingImagesByCadastralKeyUseCase } from '../../../application/usecases/queries/FindReadingImagesByCadastralKeyUseCase';
import { GetTakenReadingEstimatesOrAverageUseCase } from '../../../application/usecases/queries/GetTakenReadingEstimatesOrAverageUseCase';
import { GetPendingReadingsByMonthUseCase } from '../../../application/usecases/queries/GetPendingReadingsByMonthUseCase';
import { GetTakenReadingsByMonthUseCase } from '../../../application/usecases/queries/GetTakenReadingsByMonthUseCase';
import { GetReadingImagesByMonthUseCase } from '../../../application/usecases/queries/GetReadingImagesByMonthUseCase';
import { GetReadingImagesByMonthAndSectorUseCase } from '../../../application/usecases/queries/GetReadingImagesByMonthAndSectorUseCase';
import { ReadingAuditController } from '../../controllers/reading-audit.controller';
import { InitializeMonthlyAuditUseCase } from '../../../application/usecases/audit/InitializeMonthlyAuditUseCase';
import { GetAuditByMonthUseCase } from '../../../application/usecases/audit/GetAuditByMonthUseCase';
import { GetAuditBySectorAndMonthUseCase } from '../../../application/usecases/audit/GetAuditBySectorAndMonthUseCase';
import { CloseAuditSectorUseCase } from '../../../application/usecases/audit/CloseAuditSectorUseCase';
import { GetAuditHistoryBySectorUseCase } from '../../../application/usecases/audit/GetAuditHistoryBySectorUseCase';
import { GetReadingByNoveltyUseCase } from '../../../application/usecases/queries/GetReadingByNoveltyUseCase';
import { FindAllNoveltiesUseCase } from '../../../application/usecases/novelties/FindAllNoveltiesUseCase';
import { NoveltyPersistencePostgreSQL } from '../../repositories/postgresql/persistence/novelty.postgresql.persistence';

@Module({
  controllers: [
    ReadingController,
    ReadingReportController,
    ReadingImagesController,
    ReadingAuditController,
  ],
  providers: [
    CreateReadingUseCase,
    UpdateReadingUseCase,
    FindReadingUseCase,
    FindBasicReadingUseCase,
    GetConnectionLastReadingsReportUseCase,
    GetDailyReadingsReportUseCase,
    GetYearlyReadingsReportUseCase,
    GetDashboardMetricsUseCase,
    GetGlobalStatsReportUseCase,
    GetDailyStatsReportUseCase,
    GetSectorStatsReportUseCase,
    GetNoveltyStatsReportUseCase,
    GetAdvancedReportReadingsUseCase,
    FindReadingHistoryByCadastralKeyUseCase,
    GetAllReadingImagesUseCase,
    FindReadingImagesByCadastralKeyUseCase,
    GetTakenReadingEstimatesOrAverageUseCase,
    GetPendingReadingsByMonthUseCase,
    GetTakenReadingsByMonthUseCase,
    GetReadingImagesByMonthUseCase,
    GetReadingImagesByMonthAndSectorUseCase,
    GetReadingByNoveltyUseCase,
    // Audit use cases
    InitializeMonthlyAuditUseCase,
    GetAuditByMonthUseCase,
    GetAuditBySectorAndMonthUseCase,
    CloseAuditSectorUseCase,
    GetAuditHistoryBySectorUseCase,
    FindAllNoveltiesUseCase,

    {
      provide: 'ReadingRepository',
      useClass: ReadingPersistencePostgreSQL,
    },
    {
      provide: 'ObservationReadingRepository',
      useClass: ObservationReadingPostgreSQLPersistence,
    },
    {
      provide: 'ReadingReportRepository',
      useClass: ReadingReportPostgreSQLPersistence,
    },
    {
      provide: 'ReadingImagesRepository',
      useClass: ReadingImagesPersistencePostgreSQL,
    },
    {
      provide: 'NoveltyRepository',
      useClass: NoveltyPersistencePostgreSQL,
    },
  ],
  exports: [],
})
export class ReadingModuleUsingPostgreSQL {}
