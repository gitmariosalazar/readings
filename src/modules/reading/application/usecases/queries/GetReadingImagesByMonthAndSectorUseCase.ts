import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InterfaceReadingImagesRepository } from '../../../domain/contracts/reading-images.interface.repository';
import { ReadingImagesResponse } from '../../dtos/response/reading-images.response';
import { ReadingMapper } from '../../mappers/reading.mapper';

@Injectable()
export class GetReadingImagesByMonthAndSectorUseCase {
  constructor(
    @Inject('ReadingImagesRepository')
    private readonly readingImagesRepository: InterfaceReadingImagesRepository,
  ) {}

  async execute(
    month: string,
    sector: number,
  ): Promise<ReadingImagesResponse[]> {
    if (!month) {
      throw new BadRequestException('Month is required');
    }
    if (sector === undefined || sector === null) {
      throw new BadRequestException('Sector is required');
    }
    const readingImages =
      await this.readingImagesRepository.findReadingImagesByMonthAndSector(
        month,
        sector,
      );
    return readingImages.map(
      ReadingMapper.fromReadingImagesModelToReadingImagesResponse,
    );
  }
}
