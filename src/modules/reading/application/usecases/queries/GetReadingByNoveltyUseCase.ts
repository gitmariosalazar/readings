import { Inject, Injectable } from '@nestjs/common';
import { InterfaceReadingRepository } from '../../../domain/contracts/reading.interface.repository';
import { ReadingNoveltyResponse } from '../../dtos/response/reading.response';
import { ReadingMapper } from '../../mappers/reading.mapper';
import { ReadingNoveltyModel } from '../../../domain/schemas/model/reading.model';

@Injectable()
export class GetReadingByNoveltyUseCase {
  constructor(
    @Inject('ReadingRepository')
    private readonly readingRepository: InterfaceReadingRepository,
  ) {}

  async execute(
    dateMonth: string,
    novelty?: string,
    sector?: number,
    userId?: string,
  ): Promise<ReadingNoveltyResponse[]> {
    if (!dateMonth) {
      throw new Error('Date month is required');
    }

    const validateSectorIfExist = sector != null && sector !== undefined;
    if (validateSectorIfExist) {
      const sectorNumber = Number(sector);

      if (isNaN(sectorNumber)) {
        throw new Error('Sector must be a number');
      }
    }

    const readings: ReadingNoveltyModel[] =
      await this.readingRepository.getReadingByNovelty(
        dateMonth,
        novelty,
        sector,
        userId,
      );
    return readings.map(
      ReadingMapper.fromReadingNoveltyModelToReadingNoveltyResponse,
    );
  }
}
