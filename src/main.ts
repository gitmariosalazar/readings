import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { environments } from './settings/environments';
import * as morgan from 'morgan';

async function bootstrap() {
  const logger: Logger = new Logger('Main');

  const app = await NestFactory.create(AppModule);

  await app.listen(3005);
  app.use(morgan('dev'));
  logger.log(
    `🚀🎉 The QRCode microservice is running on: http://localhost:${3005}✅`,
  );

  const microservice = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: environments.QRCODE_KAFKA_CLIENT_ID,
        brokers: [environments.KAFKA_BROKER_URL],
      },
      consumer: {
        groupId: environments.QRCODE_KAFKA_GROUP_ID,
        allowAutoTopicCreation: true,
      },
    },
  });
  await microservice.listen();
  logger.log(`🚀🎉 The QRCode microservice is listening to KAFKA...✅`);
}
bootstrap();
