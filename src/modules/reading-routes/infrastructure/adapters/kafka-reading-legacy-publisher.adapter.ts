// readings/src/modules/reading-routes/infrastructure/adapters/kafka-reading-legacy-publisher.adapter.ts
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  IReadingLegacyPublisherPort,
  ReadingCreatedLegacyEvent,
} from '../../application/ports/reading-legacy-publisher.port';

@Injectable()
export class KafkaReadingLegacyPublisherAdapter
  implements IReadingLegacyPublisherPort, OnModuleInit
{
  private readonly logger = new Logger(KafkaReadingLegacyPublisherAdapter.name);
  private static readonly MAIN_TOPIC = 'epaa_database_legacy_topic';
  private static readonly ROUTING_PATTERN =
    'epaa-legacy.reading.create-reading-legacy';

  constructor(
    @Inject('READINGS_KAFKA_CLIENT')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
    this.logger.log('Kafka Client conectado para replicación legacy.');
  }

  async publishReadingCreated(event: ReadingCreatedLegacyEvent): Promise<void> {
    try {
      if (process.env.ENABLE_LEGACY_SYNC === 'false') {
        this.logger.debug(
          '[LegacySync] Sincronización a SQL Server 2000 deshabilitada por configuración.',
        );
        return;
      }
      this.kafkaClient.emit(KafkaReadingLegacyPublisherAdapter.MAIN_TOPIC, {
        pattern: KafkaReadingLegacyPublisherAdapter.ROUTING_PATTERN,
        data: event,
      });
      this.logger.debug(
        `[LegacySync] Evento emitido para Cuenta ${event.account}, Sector ${event.sector} (${event.month} ${event.year})`,
      );
    } catch (err: any) {
      // Fire-and-forget: El fallo al emitir jamás tumba la respuesta a la app móvil
      this.logger.error(
        `Error publicando evento legacy a Kafka: ${err.message}`,
        err.stack,
      );
    }
  }

  async publishBatchReadingsCreated(
    events: ReadingCreatedLegacyEvent[],
  ): Promise<void> {
    if (process.env.ENABLE_LEGACY_SYNC === 'false') {
      this.logger.log(
        `[LegacySync] Sincronización a SQL Server 2000 deshabilitada por configuración. Omitiendo lote de ${events.length} eventos.`,
      );
      return;
    }

    await Promise.all(events.map((e) => this.publishReadingCreated(e)));
    this.logger.log(
      `[LegacySync] ${events.length} lecturas emitidas a Kafka para SQL Server 2000.`,
    );
  }
}
