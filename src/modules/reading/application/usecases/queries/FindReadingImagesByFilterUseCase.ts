import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InterfaceReadingImagesRepository } from '../../../domain/contracts/reading-images.interface.repository';
import { ReadingImagesResponse } from '../../dtos/response/reading-images.response';
import { ReadingMapper } from '../../mappers/reading.mapper';

@Injectable()
export class FindReadingImagesByFilterUseCase {
  constructor(
    @Inject('ReadingImagesRepository')
    private readonly readingImagesRepository: InterfaceReadingImagesRepository,
  ) {}

  async execute(filter: {
    month?: string;
    cadastralKey?: string;
    sector?: number;
    date?: Date;
  }): Promise<ReadingImagesResponse[]> {
    // Implement the use case logic here
    if (!filter.month) {
      throw new BadRequestException('Month is required');
    }
    const readingImages =
      await this.readingImagesRepository.findReadingImagesByFilter(filter);
    return readingImages.map(
      ReadingMapper.fromReadingImagesModelToReadingImagesResponse,
    );
  }
}
