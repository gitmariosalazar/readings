import { Inject, Injectable } from '@nestjs/common';
import { InterfaceReadingReportRepository } from '../../../domain/contracts/reading-report.interface.repository';
import { ConnectionLastReadingsReportResponse } from '../../dtos/response/report/connection-last-readings.response';
import { ReadingReportMapper } from '../../mappers/reading-report.mapper';

@Injectable()
export class GetConnectionLastReadingsReportUseCase {
  constructor(
    @Inject('ReadingReportRepository')
    private readonly reportRepository: InterfaceReadingReportRepository,
  ) {}

  async execute(
    cadastralKey: string,
    limit: number,
  ): Promise<ConnectionLastReadingsReportResponse[]> {
    if (!cadastralKey) {
      throw new Error('Cadastral Key is required');
    }
    // Default limit 10 as requested
    const models = await this.reportRepository.findLastReadingsByConnection(
      cadastralKey,
      limit,
    );
    return ReadingReportMapper.toConnectionLastReadingsReportResponseList(
      models,
    );
  }
}
