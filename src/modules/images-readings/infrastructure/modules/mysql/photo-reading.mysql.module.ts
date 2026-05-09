import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PhotoReadingController } from '../../controllers/photo-reading.controller';
import { PhotoReadingService } from '../../../application/services/photo-reading.service';
import { PhotoReadingMySQLPersistence } from '../../repositories/mysql/persistence/mysql.photo-reading.persistence';
import { environments } from '../../../../../settings/environments/environments';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: environments.PHOTO_READING_KAFKA_CLIENT,
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [environments.KAFKA_BROKER_URL],
            clientId: environments.PHOTO_READING_KAFKA_CLIENT_ID,
          },
          consumer: {
            groupId: environments.PHOTO_READING_KAFKA_GROUP_ID,
          },
        },
      },
    ]),
  ],
  controllers: [PhotoReadingController],
  providers: [
    PhotoReadingService,
    {
      provide: 'PhotoReadingRepository',
      useClass: PhotoReadingMySQLPersistence,
    },
  ],
  exports: [],
})
export class PhotoReadingMySQLModule {}
