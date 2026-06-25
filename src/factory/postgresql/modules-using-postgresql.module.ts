import { Module } from '@nestjs/common';
import { ReadingModuleUsingPostgreSQL } from '../../modules/reading/infrastructure/modules/postgresql/postgresql.reading.module';
import { ObservationReadingPostgreSQLModule } from '../../modules/observations/infrastructure/modules/postgresql/observation-reading.postgresql.module';
import { PhotoReadingPostgreSQLModule } from '../../modules/images-readings/infrastructure/modules/postgresql/photo-reading.postgresql.module';
import { LocationModuleUsingPostgreSQL } from '../../modules/location/infrastructure/modules/postgresql/location.postgresql.module';
import { IncidentModuleUsingPostgreSQL } from '../../modules/incident/infrastructure/modules/postgresql/postgresql.incident.module';

@Module({
  imports: [
    ReadingModuleUsingPostgreSQL,
    ObservationReadingPostgreSQLModule,
    PhotoReadingPostgreSQLModule,
    LocationModuleUsingPostgreSQL,
    IncidentModuleUsingPostgreSQL,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppReadingsModulesUsingPostgreSQL { }

