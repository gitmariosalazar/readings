import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { LocationController } from "../../controllers/location.controller";
import { environments } from "../../../../../settings/environments/environments";
import { LocationService } from "../../../application/services/location.service";
import { LocationPersistenceMySQL } from "../../repositories/mysql/persistence/mysql.location.persistence";

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
    LocationService,
    {
      provide: 'LocationRepository',
      useClass: LocationPersistenceMySQL
    }
  ],
  exports: []
})
export class LocationModuleUsingMySQL {}