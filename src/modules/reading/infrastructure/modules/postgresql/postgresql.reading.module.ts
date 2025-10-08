import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { environments } from "src/settings/environments/environments";
import { ReadingController } from "../../controllers/readings.controller";
import { DatabaseServicePostgreSQL } from "src/shared/connections/database/postgresql/postgresql.service";
import { ReadingUseCaseService } from "src/modules/reading/application/services/reading.service";
import { ReadingPersistencePostgreSQL } from "../../repositories/postgresql/persistence/reading-postgresql.persistence";
import { ObservationReadingPostgreSQLPersistence } from "src/modules/observations/infrastructure/repositories/postgresql/persistence/postgresql.observation-reading.persistence";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: environments.READINGS_KAFKA_CLIENT,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: environments.READINGS_KAFKA_CLIENT_ID,
            brokers: [environments.KAFKA_BROKER_URL]
          },
          consumer: {
            groupId: environments.READINGS_KAFKA_GROUP_ID
          }
        }
      }
    ])
  ],
  controllers: [ReadingController],
  providers: [
    DatabaseServicePostgreSQL,
    ReadingUseCaseService,
    {
      provide: 'ReadingRepository',
      useClass: ReadingPersistencePostgreSQL
    },
    {
      provide: 'ObservationReadingRepository',
      useClass: ObservationReadingPostgreSQLPersistence
    }
  ],
  exports: []
})
export class ReadingModuleUsingPostgreSQL { }