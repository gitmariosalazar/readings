import { Injectable, Inject } from '@nestjs/common';
import { AdvancedReportReadingsResponse } from '../../dtos/response/report/advanced-report-readings.response';
import { InterfaceReadingReportRepository } from '../../../domain/contracts/reading-report.interface.repository';
import { ReadingReportMapper } from '../../mappers/reading-report.mapper';
import { AdvancedReportReadingsModel } from '../../../domain/schemas/model/report/advanced-report-readings.model';

@Injectable()
export class GetAdvancedReportReadingsUseCase {
  constructor(
    @Inject('ReadingReportRepository')
    private readonly reportRepository: InterfaceReadingReportRepository,
  ) {}

  async execute(month: string): Promise<AdvancedReportReadingsResponse[]> {
    if (!month) {
      throw new Error('Month is required');
    }
    const models: AdvancedReportReadingsModel[] =
      await this.reportRepository.findAdvancedReportReadings(month);
    return ReadingReportMapper.toAdvancedReportReadingsResponseList(models);
  }
}
