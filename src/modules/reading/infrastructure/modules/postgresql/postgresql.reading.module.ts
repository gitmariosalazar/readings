import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ReadingController } from '../../controllers/readings.controller';
import { ReadingPersistencePostgreSQL } from '../../repositories/postgresql/persistence/reading-postgresql.persistence';
import { environments } from '../../../../../settings/environments/environments';
import { DatabaseServicePostgreSQL } from '../../../../../shared/connections/database/postgresql/postgresql.service';
import { ObservationReadingPostgreSQLPersistence } from '../../../../observations/infrastructure/repositories/postgresql/persistence/postgresql.observation-reading.persistence';

import { CreateReadingUseCase } from '../../../application/usecases/commands/CreateReadingUseCase';
import { UpdateReadingUseCase } from '../../../application/usecases/commands/UpdateReadingUseCase';
import { FindReadingUseCase } from '../../../application/usecases/queries/FindReadingUseCase';
import { FindBasicReadingUseCase } from '../../../application/usecases/queries/FindBasicReadingUseCase';

import { ReadingReportController } from '../../controllers/reading-report.controller';
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

@Module({
  imports: [
    ClientsModule.register([
      {
        name: environments.READINGS_KAFKA_CLIENT,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: environments.READINGS_KAFKA_CLIENT_ID,
            brokers: [environments.KAFKA_BROKER_URL],
          },
          consumer: {
            groupId: environments.READINGS_KAFKA_GROUP_ID,
          },
        },
      },
    ]),
  ],
  controllers: [ReadingController, ReadingReportController],
  providers: [
    DatabaseServicePostgreSQL,
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
  ],
  exports: [],
})
export class ReadingModuleUsingPostgreSQL {}
