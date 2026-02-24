import { Inject, Injectable } from '@nestjs/common';
import { DailyReadingsReportResponse } from '../../dtos/response/report/daily-readings.response';
import { InterfaceReadingReportRepository } from '../../../domain/contracts/reading-report.interface.repository';
import { ReadingReportMapper } from '../../mappers/reading-report.mapper';
import { DailyReadingsReportModel } from '../../../domain/schemas/model/report/daily-readings.model';

@Injectable()
export class GetDailyReadingsReportUseCase {
  constructor(
    @Inject('ReadingReportRepository')
    private readonly reportRepository: InterfaceReadingReportRepository,
  ) {}

  async execute(date: string): Promise<DailyReadingsReportResponse[]> {
    // Basic date validation could be added here
    if (!date) {
      throw new Error('Date is required (YYYY-MM-DD)');
    }
    const models = await this.reportRepository.findReadingsByDate(date);
    return ReadingReportMapper.toDailyReadingsReportResponseList(models);
  }
}
