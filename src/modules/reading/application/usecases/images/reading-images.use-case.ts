import { Inject, Injectable } from '@nestjs/common';
import { InterfaceReadingImagesRepository } from '../../../domain/contracts/reading-images.interface.repository';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from '../../../../../settings/environments/status-code';
import { ReadingImagesResponse } from '../../dtos/response/reading-images.response';
import { ReadingImagesModel } from '../../../domain/schemas/model/reading-images.model';

@Injectable()
export class ReadingImagesUseCase {
  constructor(
    @Inject('ReadingRepository')
    private readonly readingRepository: InterfaceReadingImagesRepository,
  ) {}

  async executeFindImagesByCadastralKey(
    cadastralKey: string,
  ): Promise<ReadingImagesModel[]> {
    if (!cadastralKey) {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: 'Cadastral key is required',
      });
    }

    const images =
      await this.readingRepository.findReadingImagesByCadastralKey(
        cadastralKey,
      );
    return images;
  }
}
