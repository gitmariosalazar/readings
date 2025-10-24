import { Module } from "@nestjs/common";
import { PhotoReadingPostgreSQLModule } from "src/modules/images-readings/infrastructure/modules/postgresql/photo-reading.postgresql.module";
import { LocationModuleUsingPostgreSQL } from "src/modules/location/infrastructure/modules/postgresql/location.postgresql.module";
import { ObservationReadingPostgreSQLModule } from "src/modules/observations/infrastructure/modules/postgresql/observation-reading.postgresql.module";
import { ReadingModuleUsingPostgreSQL } from "src/modules/reading/infrastructure/modules/postgresql/postgresql.reading.module";

@Module({
  imports: [ReadingModuleUsingPostgreSQL, ObservationReadingPostgreSQLModule, PhotoReadingPostgreSQLModule, LocationModuleUsingPostgreSQL],
  controllers: [],
  providers: [],
  exports: []
})
export class AppReadingsModulesUsingPostgreSQL { }