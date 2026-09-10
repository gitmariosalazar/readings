import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { ReadingInfoResponse } from '../../dtos/response/reading-basic.response';
import { InterfaceReadingRepository } from '../../../domain/contracts/reading.interface.repository';
import { ReadingInfoMapper } from '../../mappers/reading-info.mapper';

@Injectable()
export class FindReadingUseCase {
  constructor(
    @Inject('ReadingRepository')
    private readonly readingRepository: InterfaceReadingRepository,
  ) {}

  async execute(cadastralKey: string): Promise<ReadingInfoResponse[]> {
    if (!cadastralKey) {
      throw new BadRequestException('Cadastral key is required');
    }

    const domainModels =
      await this.readingRepository.findReadingInfo(cadastralKey);
    return ReadingInfoMapper.toInfoResponseList(domainModels);
  }

  async executeForUpdated(
    cadastralKey: string,
    yearAndMonth?: string,
  ): Promise<ReadingInfoResponse[]> {
    if (!cadastralKey) {
      throw new BadRequestException('Cadastral key is required');
    }

    const domainModels = await this.readingRepository.findReadingInfoForUpdated(
      cadastralKey,
      yearAndMonth,
    );
    return ReadingInfoMapper.toInfoResponseList(domainModels);
  }
}
