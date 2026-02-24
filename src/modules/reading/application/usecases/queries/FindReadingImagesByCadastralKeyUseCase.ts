import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InterfaceReadingRepository } from '../../../domain/contracts/reading.interface.repository';
import { ReadingImagesResponse } from '../../dtos/response/reading-images.response';
import { ReadingMapper } from '../../mappers/reading.mapper';

@Injectable()
export class FindReadingImagesByCadastralKeyUseCase {
  constructor(
    @Inject('ReadingRepository')
    private readonly readingRepository: InterfaceReadingRepository,
  ) {}

  async execute(cadastralKey: string): Promise<ReadingImagesResponse[]> {
    if (!cadastralKey) {
      throw new BadRequestException('Cadastral key is required');
    }
    const readingImages =
      await this.readingRepository.findReadingsImagesByCadastralKey(
        cadastralKey,
      );
    return readingImages.map(
      ReadingMapper.fromReadingImagesModelToReadingImagesResponse,
    );
  }
}
