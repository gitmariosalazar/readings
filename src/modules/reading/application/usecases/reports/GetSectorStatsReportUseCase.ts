import { Inject, Injectable } from '@nestjs/common';
import { InterfaceReadingReportRepository } from '../../../domain/contracts/reading-report.interface.repository';
import { SectorStatsReportResponse } from '../../dtos/response/report/sector-stats.response';
import { ReadingReportMapper } from '../../mappers/reading-report.mapper';
@Injectable()
export class GetSectorStatsReportUseCase {
  constructor(
    @Inject('ReadingReportRepository')
    private readonly reportRepository: InterfaceReadingReportRepository,
  ) {}

  async execute(month: string): Promise<SectorStatsReportResponse[]> {
    if (!month) {
      throw new Error('Month is required (YYYY-MM)');
    }
    const result = await this.reportRepository.findSectorStats(month);
    return ReadingReportMapper.toSectorStatsReportResponseList(result);
  }
}
