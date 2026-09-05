import { Inject, Injectable, Logger } from '@nestjs/common';
import { InterfaceReadingRepository } from '../../domain/contracts/reading.interface.repository';

export interface MeterChangedIntegrationEvent {
  acometidaId: string;
  nuevoNumeroMedidor: string;
  sector: number;
  cuenta: number;
  claveCatastral: string;
  fechaInicioLecturas: Date | string;
}

@Injectable()
export class GenerateInitialReadingOnMeterChangeUseCase {
  private readonly logger = new Logger(
    GenerateInitialReadingOnMeterChangeUseCase.name,
  );

  constructor(
    @Inject('ReadingRepository')
    private readonly readingRepository: InterfaceReadingRepository,
  ) {}

  async execute(event: MeterChangedIntegrationEvent): Promise<void> {
    try {
      this.logger.log(
        `Processing meter change event for acometidaId ${event.acometidaId}, new meter ${event.nuevoNumeroMedidor}`,
      );
      await this.readingRepository.generateInitialReadingOnMeterChange(
        event.acometidaId,
        event.nuevoNumeroMedidor,
        event.sector,
        event.cuenta,
        event.claveCatastral,
        event.fechaInicioLecturas,
      );
      this.logger.log(
        `Successfully generated initial reading and calculated next reading for acometidaId ${event.acometidaId}`,
      );
    } catch (error) {
      this.logger.error(
        `Error in GenerateInitialReadingOnMeterChangeUseCase for acometidaId ${event.acometidaId}:`,
        error,
      );
      throw error;
    }
  }
}
