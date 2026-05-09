import { Module } from '@nestjs/common';
import { ObservationReadingController } from '../../controllers/observation-reading.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { environments } from '../../../../../settings/environments/environments';
import { ObservationReadingService } from '../../../application/services/observation-reading.service';
import { ObservationReadingMySQLPersistence } from '../../repositories/mysql/persistence/mysql.observation-reading.persistence';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: environments.OBSERVATION_KAFKA_CLIENT,
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [environments.KAFKA_BROKER_URL],
            clientId: environments.OBSERVATION_KAFKA_CLIENT_ID,
          },
          consumer: {
            groupId: environments.OBSERVATION_KAFKA_GROUP_ID,
          },
        },
      },
    ]),
  ],
  controllers: [ObservationReadingController],
  providers: [
    ObservationReadingService,
    {
      provide: 'ObservationReadingRepository',
      useClass: ObservationReadingMySQLPersistence,
    },
  ],
  exports: [],
})
export class ObservationReadingMySQLModule {}
