import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { environments } from './settings/environments';

async function bootstrap() {
  const logger: Logger = new Logger('Main');
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
  logger.log(`🚀🎉 The Documents microservice is listening to KAFKA...✅`);
}
bootstrap();
