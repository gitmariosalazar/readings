import { Inject, Injectable } from '@nestjs/common';
import { InterfaceReadingImagesRepository } from '../../../domain/contracts/reading-images.interface.repository';
import { ReadingImagesResponse } from '../../dtos/response/reading-images.response';
import { ReadingMapper } from '../../mappers/reading.mapper';

@Injectable()
export class GetAllReadingImagesUseCase {
  constructor(
    @Inject('ReadingImagesRepository')
    private readonly readingImagesRepository: InterfaceReadingImagesRepository,
  ) {}

  async execute(): Promise<ReadingImagesResponse[]> {
    const readingImages =
      await this.readingImagesRepository.getAllReadingsImages();
    return readingImages.map(
      ReadingMapper.fromReadingImagesModelToReadingImagesResponse,
    );
  }
}
