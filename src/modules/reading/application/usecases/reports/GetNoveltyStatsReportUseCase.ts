import { Inject, Injectable } from '@nestjs/common';
import { InterfaceReadingReportRepository } from '../../../domain/contracts/reading-report.interface.repository';
import { NoveltyStatsReportResponse } from '../../dtos/response/report/novelty-stats.response';
import { ReadingReportMapper } from '../../mappers/reading-report.mapper';
@Injectable()
export class GetNoveltyStatsReportUseCase {
  constructor(
    @Inject('ReadingReportRepository')
    private readonly reportRepository: InterfaceReadingReportRepository,
  ) {}

  async execute(month: string): Promise<NoveltyStatsReportResponse[]> {
    if (!month) {
      throw new Error('Month is required (YYYY-MM)');
    }
    const result = await this.reportRepository.findNoveltyStats(month);
    return ReadingReportMapper.toNoveltyStatsReportResponseList(result);
  }
}
