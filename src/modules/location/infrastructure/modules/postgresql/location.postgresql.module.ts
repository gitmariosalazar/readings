import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { environments } from "src/settings/environments/environments";
import { LocationController } from "../../controllers/location.controller";
import { DatabaseServicePostgreSQL } from "src/shared/connections/database/postgresql/postgresql.service";
import { LocationService } from "src/modules/location/application/services/location.service";
import { LocationPersistencePostgresql } from "../../repositories/postgresql/persistence/postgresql.location.persistence";

@Module({
  imports: [
    ClientsModule.register([
      {

        name: environments.LOCATION_CONNECTION_KAFKA_CLIENT,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: environments.LOCATION_CONNECTION_KAFKA_CLIENT_ID,
            brokers: [environments.KAFKA_BROKER_URL]
          },
          consumer: {
            groupId: environments.LOCATION_CONNECTION_KAFKA_GROUP_ID
          }
        }
      }
    ]),
  ],
  controllers: [LocationController],
  providers: [
    DatabaseServicePostgreSQL,
    LocationService,
    {
      provide: 'LocationRepository',
      useClass: LocationPersistencePostgresql
    }
  ],
  exports: []
})
export class LocationModuleUsingPostgreSQL { }