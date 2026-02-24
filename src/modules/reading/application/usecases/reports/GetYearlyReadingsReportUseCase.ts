import { Inject, Injectable } from '@nestjs/common';
import { InterfaceReadingReportRepository } from '../../../domain/contracts/reading-report.interface.repository';
import { YearlyReadingsReportResponse } from '../../dtos/response/report/yearly-readings.response';
import { ReadingReportMapper } from '../../mappers/reading-report.mapper';
@Injectable()
export class GetYearlyReadingsReportUseCase {
  constructor(
    @Inject('ReadingReportRepository')
    private readonly reportRepository: InterfaceReadingReportRepository,
  ) {}

  async execute(year: number): Promise<YearlyReadingsReportResponse> {
    if (!year || year < 2000 || year > 2100) {
      throw new Error('Valid year is required');
    }
    const result = await this.reportRepository.findYearlyReport(year);
    return ReadingReportMapper.toYearlyReadingsReportResponse(result);
  }
}
