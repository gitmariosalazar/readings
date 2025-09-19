import { Module } from "@nestjs/common";
import { ReadingModuleUsingPostgreSQL } from "src/modules/reading/infrastructure/modules/postgresql/postgresql.reading.module";

@Module({
  imports: [ReadingModuleUsingPostgreSQL],
  controllers: [],
  providers: [],
  exports: []
})
export class AppReadingsModulesUsingPostgreSQL { }