import { Module } from '@nestjs/common';
import { ReadingModuleUsingMySQL } from '../../modules/reading/infrastructure/modules/mysql/mysql.reading.module';
import { ObservationReadingMySQLModule } from '../../modules/observations/infrastructure/modules/mysql/observation-reading.mysql.module';
import { PhotoReadingMySQLModule } from '../../modules/images-readings/infrastructure/modules/mysql/photo-reading.mysql.module';
import { LocationModuleUsingMySQL } from '../../modules/location/infrastructure/modules/mysql/location.mysql.module';

@Module({
  imports: [
    ReadingModuleUsingMySQL,
    ObservationReadingMySQLModule,
    PhotoReadingMySQLModule,
    LocationModuleUsingMySQL,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppReadingsModulesUsingMySQL {}
