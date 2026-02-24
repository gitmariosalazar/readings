import { Inject, Injectable } from '@nestjs/common';
import { DailyStatsReportResponse } from '../../dtos/response/report/daily-stats.response';
import { InterfaceReadingReportRepository } from '../../../domain/contracts/reading-report.interface.repository';
import { ReadingReportMapper } from '../../mappers/reading-report.mapper';
import { DailyStatsReportModel } from '../../../domain/schemas/model/report/daily-stats.model';

@Injectable()
export class GetDailyStatsReportUseCase {
  constructor(
    @Inject('ReadingReportRepository')
    private readonly reportRepository: InterfaceReadingReportRepository,
  ) {}

  async execute(month: string): Promise<DailyStatsReportResponse[]> {
    if (!month) {
      throw new Error('Month is required (YYYY-MM)');
    }
    console.log(month);
    const models = await this.reportRepository.findDailyStats(month);
    return ReadingReportMapper.toDailyStatsReportResponseList(models);
  }
}
