import { Inject, Injectable } from '@nestjs/common';
import { InterfaceReadingReportRepository } from '../../../domain/contracts/reading-report.interface.repository';
import { DashboardMetricsResponse } from '../../dtos/response/report/dashboard-metrics.response';
import { ReadingReportMapper } from '../../mappers/reading-report.mapper';
@Injectable()
export class GetDashboardMetricsUseCase {
  constructor(
    @Inject('ReadingReportRepository')
    private readonly reportRepository: InterfaceReadingReportRepository,
  ) {}

  async execute(date: string): Promise<DashboardMetricsResponse> {
    const metrics = await this.reportRepository.findDashboardMetrics(date);
    return ReadingReportMapper.toDashboardMetricsResponse(metrics);
  }
}
