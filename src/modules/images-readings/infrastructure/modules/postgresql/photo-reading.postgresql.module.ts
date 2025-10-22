import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { environments } from "src/settings/environments/environments";
import { PhotoReadingController } from "../../controllers/photo-reading.controller";
import { DatabaseServicePostgreSQL } from "src/shared/connections/database/postgresql/postgresql.service";
import { PhotoReadingPostgreSQLPersistence } from "../../repositories/postgresql/persistence/postgresql.photo-reading.persistence";
import { PhotoReadingService } from "src/modules/images-readings/application/services/photo-reading.service";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: environments.PHOTO_READING_KAFKA_CLIENT,
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [environments.KAFKA_BROKER_URL],
            clientId: environments.PHOTO_READING_KAFKA_CLIENT_ID
          },
          consumer: {
            groupId: environments.PHOTO_READING_KAFKA_GROUP_ID
          }
        }
      }
    ]),
  ],
  controllers: [
    PhotoReadingController
  ],
  providers: [
    DatabaseServicePostgreSQL,
    PhotoReadingService,
    {
      provide: 'PhotoReadingRepository',
      useClass: PhotoReadingPostgreSQLPersistence
    }
  ],
  exports: []
})
export class PhotoReadingPostgreSQLModule { }