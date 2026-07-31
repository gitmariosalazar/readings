import { Inject, Injectable } from '@nestjs/common';
import { InterfaceReadingRepository } from '../../../domain/contracts/reading.interface.repository';

@Injectable()
export class CalculateReadingValueUseCase {
  constructor(
    @Inject('ReadingRepository')
    private readonly readingRepository: InterfaceReadingRepository,
  ) {}

  async execute(cadastralKey: string, consumptionM3: number): Promise<number> {
    return this.readingRepository.calculateReadingValue(
      cadastralKey,
      consumptionM3,
    );
  }
}
