import { Inject, Injectable } from '@nestjs/common';
import { InterfaceReadingRepository } from '../../../domain/contracts/reading.interface.repository';
import { ReadingHistoryResponse } from '../../dtos/response/reading-history.response';
import { ReadingMapper } from '../../mappers/reading.mapper';

@Injectable()
export class FindReadingHistoryByCadastralKeyUseCase {
  constructor(
    @Inject('ReadingRepository')
    private readonly readingRepository: InterfaceReadingRepository,
  ) {}

  async execute(
    cadastralKey: string,
    limit: number,
    offset: number,
  ): Promise<ReadingHistoryResponse[]> {
    const readingHistory =
      await this.readingRepository.findReadingHistoryByCadastralKey(
        cadastralKey,
        limit,
        offset,
      );
    return readingHistory.map((readingHistory) =>
      ReadingMapper.fromReadingHistoryModelToReadingHistoryResponse(
        readingHistory,
      ),
    );
  }
}
