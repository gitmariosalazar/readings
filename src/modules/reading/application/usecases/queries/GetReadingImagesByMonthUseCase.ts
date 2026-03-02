import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InterfaceReadingImagesRepository } from '../../../domain/contracts/reading-images.interface.repository';
import { ReadingImagesResponse } from '../../dtos/response/reading-images.response';
import { ReadingMapper } from '../../mappers/reading.mapper';

@Injectable()
export class GetReadingImagesByMonthUseCase {
  constructor(
    @Inject('ReadingImagesRepository')
    private readonly readingImagesRepository: InterfaceReadingImagesRepository,
  ) {}

  async execute(month: string): Promise<ReadingImagesResponse[]> {
    if (!month) {
      throw new BadRequestException('Month is required');
    }
    const readingImages =
      await this.readingImagesRepository.findReadingImagesByMonth(month);
    return readingImages.map(
      ReadingMapper.fromReadingImagesModelToReadingImagesResponse,
    );
  }
}
