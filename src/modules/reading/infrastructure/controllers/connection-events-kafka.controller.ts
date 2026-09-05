import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { GenerateInitialReadingOnMeterChangeUseCase, MeterChangedIntegrationEvent } from '../../application/use-cases/generate-initial-reading-on-meter-change.usecase';

@Controller()
export class ConnectionEventsKafkaController {
  private readonly logger = new Logger(ConnectionEventsKafkaController.name);

  constructor(
    private readonly generateInitialReadingUseCase: GenerateInitialReadingOnMeterChangeUseCase,
  ) {}

  @EventPattern('connection.meter.changed')
  async handleMeterChangedEvent(@Payload() event: MeterChangedIntegrationEvent) {
    this.logger.log(`Received connection.meter.changed event for acometidaId ${event.acometidaId}`);
    try {
      await this.generateInitialReadingUseCase.execute(event);
    } catch (error) {
      this.logger.error(`Failed to handle connection.meter.changed event for acometidaId ${event.acometidaId}`, error);
    }
  }
}
