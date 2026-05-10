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
    const cleanDate = typeof date === 'string' ? date.replace(/['"]+/g, '') : date;
    console.log(`date payload`, cleanDate);
    return this.getDailyReadingsUseCase.execute(cleanDate);
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
    const cleanDate = typeof date === 'string' ? date.replace(/['"]+/g, '') : date;
    return this.getDashboardMetricsUseCase.execute(cleanDate);
  }

  @MessagePattern('reading.report.stats.global')
  async getGlobalStats(
    @Payload() month: string,
  ): Promise<GlobalStatsReportResponse> {
    const cleanMonth = typeof month === 'string' ? month.replace(/['"]+/g, '') : month;
    return this.getGlobalStatsUseCase.execute(cleanMonth);
  }

  @MessagePattern('reading.report.stats.daily')
  async getDailyStats(
    @Payload() month: string,
  ): Promise<DailyStatsReportResponse[]> {
    const cleanMonth = typeof month === 'string' ? month.replace(/['"]+/g, '') : month;
    return this.getDailyStatsUseCase.execute(cleanMonth);
  }

  @MessagePattern('reading.report.stats.sector')
  async getSectorStats(
    @Payload() month: string,
  ): Promise<SectorStatsReportResponse[]> {
    const cleanMonth = typeof month === 'string' ? month.replace(/['"]+/g, '') : month;
    return this.getSectorStatsUseCase.execute(cleanMonth);
  }

  @MessagePattern('reading.report.stats.novelty')
  async getNoveltyStats(
    @Payload() month: string,
  ): Promise<NoveltyStatsReportResponse[]> {
    const cleanMonth = typeof month === 'string' ? month.replace(/['"]+/g, '') : month;
    return this.getNoveltyStatsUseCase.execute(cleanMonth);
  }

  @MessagePattern('reading.report.advanced-monthly')
  async getAdvancedReportReadings(
    @Payload() month: string,
  ): Promise<AdvancedReportReadingsResponse[]> {
    const cleanMonth = typeof month === 'string' ? month.replace(/['"]+/g, '') : month;
    return this.getAdvancedReportReadingsUseCase.execute(cleanMonth);
  }
}
