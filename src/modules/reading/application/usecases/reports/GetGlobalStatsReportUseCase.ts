import { Inject, Injectable } from '@nestjs/common';
import { InterfaceReadingReportRepository } from '../../../domain/contracts/reading-report.interface.repository';
import { GlobalStatsReportResponse } from '../../dtos/response/report/global-stats.response';
import { ReadingReportMapper } from '../../mappers/reading-report.mapper';
@Injectable()
export class GetGlobalStatsReportUseCase {
  constructor(
    @Inject('ReadingReportRepository')
    private readonly reportRepository: InterfaceReadingReportRepository,
  ) {}

  async execute(month: string): Promise<GlobalStatsReportResponse> {
    if (!month) {
      throw new Error('Month is required (YYYY-MM)');
    }
    const result = await this.reportRepository.findGlobalStats(month);
    return ReadingReportMapper.toGlobalStatsReportResponse(result);
  }
}
