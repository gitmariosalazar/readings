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
    if (!filter.month && !filter.cadastralKey && !filter.sector && !filter.date) {
      const now = new Date();
      const year = now.getFullYear();
      const monthStr = String(now.getMonth() + 1).padStart(2, '0');
      filter.month = `${year}-${monthStr}`;
    }
    const readingImages =
      await this.readingImagesRepository.findReadingImagesByFilter(filter);
    return readingImages.map(
      ReadingMapper.fromReadingImagesModelToReadingImagesResponse,
    );
  }
}
