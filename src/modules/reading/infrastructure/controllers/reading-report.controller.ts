import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetConnectionLastReadingsReportUseCase } from '../../application/usecases/reports/GetConnectionLastReadingsReportUseCase';
import { GetDailyReadingsReportUseCase } from '../../application/usecases/reports/GetDailyReadingsReportUseCase';
import { GetYearlyReadingsReportUseCase } from '../../application/usecases/reports/GetYearlyReadingsReportUseCase';
import { GetDashboardMetricsUseCase } from '../../application/usecases/dashboard/GetDashboardMetricsUseCase';
import { GetGlobalStatsReportUseCase } from '../../application/usecases/reports/GetGlobalStatsReportUseCase';
import { GetDailyStatsReportUseCase } from '../../application/usecases/reports/GetDailyStatsReportUseCase';
import { GetSectorStatsReportUseCase } from '../../application/usecases/reports/GetSectorStatsReportUseCase';
import { GetNoveltyStatsReportUseCase } from '../../application/usecases/reports/GetNoveltyStatsReportUseCase';
import { ConnectionLastReadingsReportResponse } from '../../application/dtos/response/report/connection-last-readings.response';
import { DailyReadingsReportResponse } from '../../application/dtos/response/report/daily-readings.response';
import { YearlyReadingsReportResponse } from '../../application/dtos/response/report/yearly-readings.response';
import { DashboardMetricsResponse } from '../../application/dtos/response/report/dashboard-metrics.response';
import { GlobalStatsReportResponse } from '../../application/dtos/response/report/global-stats.response';
import { DailyStatsReportResponse } from '../../application/dtos/response/report/daily-stats.response';
import { SectorStatsReportResponse } from '../../application/dtos/response/report/sector-stats.response';
import { NoveltyStatsReportResponse } from '../../application/dtos/response/report/novelty-stats.response';
import { AdvancedReportReadingsResponse } from '../../application/dtos/response/report/advanced-report-readings.response';
import { GetAdvancedReportReadingsUseCase } from '../../application/usecases/reports/GetAdvancedReportReadingsUseCase';

@Controller()
export class ReadingReportController {
  constructor(
    private readonly getConnectionLastReadingsUseCase: GetConnectionLastReadingsReportUseCase,
    private readonly getDailyReadingsUseCase: GetDailyReadingsReportUseCase,
    private readonly getYearlyReadingsUseCase: GetYearlyReadingsReportUseCase,
    private readonly getDashboardMetricsUseCase: GetDashboardMetricsUseCase,
    private readonly getGlobalStatsUseCase: GetGlobalStatsReportUseCase,
    private readonly getDailyStatsUseCase: GetDailyStatsReportUseCase,
    private readonly getSectorStatsUseCase: GetSectorStatsReportUseCase,
    private readonly getNoveltyStatsUseCase: GetNoveltyStatsReportUseCase,
    private readonly getAdvancedReportReadingsUseCase: GetAdvancedReportReadingsUseCase,
  ) {}

  @MessagePattern('reading.report.connection.last-10')
  async getLastReadingsForConnection(
    @Payload() payload: { cadastralKey: string; limit: number },
  ): Promise<ConnectionLastReadingsReportResponse[]> {
    const { cadastralKey, limit } = payload;
    return this.getConnectionLastReadingsUseCase.execute(cadastralKey, limit);
  }

  @MessagePattern('reading.report.daily')
  async getDailyReport(
    @Payload() date: string,
  ): Promise<DailyReadingsReportResponse[]> {
    console.log(`date payload`, date);
    return this.getDailyReadingsUseCase.execute(date);
  }

  @MessagePattern('reading.report.yearly')
  async getYearlyReport(
    @Payload() year: number,
  ): Promise<YearlyReadingsReportResponse> {
    return this.getYearlyReadingsUseCase.execute(year);
  }

  @MessagePattern('reading.dashboard.metrics')
  async getDashboardMetrics(
    @Payload() date: string,
  ): Promise<DashboardMetricsResponse> {
    return this.getDashboardMetricsUseCase.execute(date);
  }

  @MessagePattern('reading.report.stats.global')
  async getGlobalStats(
    @Payload() month: string,
  ): Promise<GlobalStatsReportResponse> {
    return this.getGlobalStatsUseCase.execute(month);
  }

  @MessagePattern('reading.report.stats.daily')
  async getDailyStats(
    @Payload() month: string,
  ): Promise<DailyStatsReportResponse[]> {
    return this.getDailyStatsUseCase.execute(month);
  }

  @MessagePattern('reading.report.stats.sector')
  async getSectorStats(
    @Payload() month: string,
  ): Promise<SectorStatsReportResponse[]> {
    return this.getSectorStatsUseCase.execute(month);
  }

  @MessagePattern('reading.report.stats.novelty')
  async getNoveltyStats(
    @Payload() month: string,
  ): Promise<NoveltyStatsReportResponse[]> {
    return this.getNoveltyStatsUseCase.execute(month);
  }

  @MessagePattern('reading.report.advanced-monthly')
  async getAdvancedReportReadings(
    @Payload() month: string,
  ): Promise<AdvancedReportReadingsResponse[]> {
    return this.getAdvancedReportReadingsUseCase.execute(month);
  }
}
