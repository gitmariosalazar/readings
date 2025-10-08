import { Module } from "@nestjs/common";
import { ObservationReadingPostgreSQLModule } from "src/modules/observations/infrastructure/modules/postgresql/observation-reading.postgresql.module";
import { ReadingModuleUsingPostgreSQL } from "src/modules/reading/infrastructure/modules/postgresql/postgresql.reading.module";

@Module({
  imports: [ReadingModuleUsingPostgreSQL, ObservationReadingPostgreSQLModule],
  controllers: [],
  providers: [],
  exports: []
})
export class AppReadingsModulesUsingPostgreSQL { }