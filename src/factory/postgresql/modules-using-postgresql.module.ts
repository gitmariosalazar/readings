import { Module } from '@nestjs/common';
import { ReadingModuleUsingPostgreSQL } from '../../modules/reading/infrastructure/modules/postgresql/postgresql.reading.module';
import { ReadingAnalyticsModuleUsingPostgreSQL } from '../../modules/analytics/infrastructure/modules/postgresql/postgresql.reading-analytics.module';
import { ObservationReadingPostgreSQLModule } from '../../modules/observations/infrastructure/modules/postgresql/observation-reading.postgresql.module';
import { PhotoReadingPostgreSQLModule } from '../../modules/images-readings/infrastructure/modules/postgresql/photo-reading.postgresql.module';
import { LocationModuleUsingPostgreSQL } from '../../modules/location/infrastructure/modules/postgresql/location.postgresql.module';
import { IncidentModuleUsingPostgreSQL } from '../../modules/incident/infrastructure/modules/postgresql/postgresql.incident.module';
import { ReadingRoutesModule } from '../../modules/reading-routes/infrastructure/modules/reading-routes.module';

@Module({
  imports: [
    ReadingModuleUsingPostgreSQL,
    ReadingAnalyticsModuleUsingPostgreSQL,
    ObservationReadingPostgreSQLModule,
    PhotoReadingPostgreSQLModule,
    LocationModuleUsingPostgreSQL,
    IncidentModuleUsingPostgreSQL,
    ReadingRoutesModule,
  ],
  controllers: [],
  providers: [],
  exports: [ReadingRoutesModule, ReadingAnalyticsModuleUsingPostgreSQL],
})
export class AppReadingsModulesUsingPostgreSQL { }


