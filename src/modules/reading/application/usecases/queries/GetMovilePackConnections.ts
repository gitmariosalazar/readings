import { Inject, Injectable } from '@nestjs/common';
import { InterfaceReadingRepository } from '../../../domain/contracts/reading.interface.repository';
import { ReadingInfoResponse } from '../../dtos/response/reading-basic.response';
import { ReadingInfoMapper } from '../../mappers/reading-info.mapper';

@Injectable()
export class GetMovilePackConnectionsUseCase {
  constructor(
    @Inject('ReadingRepository')
    private readonly readingRepository: InterfaceReadingRepository,
  ) {}

  async execute(filters?: {
    sector?: number;
    cadastralKeys?: string[];
  }): Promise<ReadingInfoResponse[]> {
    const result =
      await this.readingRepository.getMovileWorkPackConnections(filters);
    if (!result || result.length === 0) {
      return [];
    }
    const mappedResult = ReadingInfoMapper.toInfoResponseList(result);
    return mappedResult;
  }
}
