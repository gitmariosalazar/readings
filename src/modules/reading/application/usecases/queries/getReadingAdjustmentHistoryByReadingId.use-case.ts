import { Inject, Injectable } from '@nestjs/common';
import { InterfaceReadingRepository } from '../../../domain/contracts/reading.interface.repository';
import { HistorialAjusteLectura } from '../../../domain/schemas/response/map-geojson';

@Injectable()
export class GetReadingAdjustmentHistoryByReadingIdUseCase {
  constructor(
    @Inject('ReadingRepository')
    private readonly readingRepository: InterfaceReadingRepository,
  ) {}

  async execute(readingId: number): Promise<HistorialAjusteLectura[]> {
    return this.readingRepository.getReadingAdjustmentHistoryByReadingId(
      readingId,
    );
  }
}
