import { Inject, Injectable } from '@nestjs/common';
import {
  ReadingDetailedModel,
  ReadingInfoModel,
} from '../../../domain/schemas/model/reading-info.model';
import { InterfaceReadingRepository } from '../../../domain/contracts/reading.interface.repository';

@Injectable()
export class GetDetailedReadingInfoByCadastralKeyUseCase {
  constructor(
    @Inject('ReadingRepository')
    private readonly readingRepository: InterfaceReadingRepository,
  ) {}

  async execute(
    cadastralKey: string,
    yearAndMonth: string,
  ): Promise<ReadingDetailedModel | null> {
    try {
      if (!cadastralKey) {
        throw new Error('Cadastral key is required');
      }
      if (!yearAndMonth) {
        throw new Error('Year and month are required');
      }

      const readingInfo =
        await this.readingRepository.getDetailedReadingInfoByCadastralKey(
          cadastralKey,
          yearAndMonth,
        );

      return readingInfo;
    } catch (error) {
      throw error;
    }
  }
}
