import { ConnectionLastReadingsReportModel } from '../schemas/model/report/connection-last-readings.model';
import { DailyReadingsReportModel } from '../schemas/model/report/daily-readings.model';
import { YearlyReadingsReportModel } from '../schemas/model/report/yearly-readings.model';
import { DashboardMetricsModel } from '../schemas/model/report/dashboard-metrics.model';
import { GlobalStatsReportModel } from '../schemas/model/report/global-stats.model';
import { DailyStatsReportModel } from '../schemas/model/report/daily-stats.model';
import { SectorStatsReportModel } from '../schemas/model/report/sector-stats.model';
import { NoveltyStatsReportModel } from '../schemas/model/report/novelty-stats.model';
import { AdvancedReportReadingsModel } from '../schemas/model/report/advanced-report-readings.model';
import {
  AuditSectorHistoryModel,
  AuditSectorModel,
  CloseAuditSectorModel,
  InitializeAuditModel,
} from '../schemas/model/report/audit-sector.model';

export interface InterfaceReadingReportRepository {
  findLastReadingsByConnection(
    cadastralKey: string,
    limit: number,
  ): Promise<ConnectionLastReadingsReportModel[]>;
  findReadingsByDate(date: string): Promise<DailyReadingsReportModel[]>;
  findYearlyReport(year: number): Promise<YearlyReadingsReportModel>;
  findDashboardMetrics(date: string): Promise<DashboardMetricsModel>;
  findGlobalStats(month: string): Promise<GlobalStatsReportModel>;
  findDailyStats(month: string): Promise<DailyStatsReportModel[]>;
  findSectorStats(month: string): Promise<SectorStatsReportModel[]>;
  findNoveltyStats(month: string): Promise<NoveltyStatsReportModel[]>;
  findAdvancedReportReadings(
    month: string,
  ): Promise<AdvancedReportReadingsModel[]>;

  // ── Audit ─────────────────────────────────────────────────────────────────────
  initializeMonthlyAudit(month: string): Promise<InitializeAuditModel>;
  getAuditByMonth(month: string): Promise<AuditSectorModel[]>;
  getAuditBySectorAndMonth(
    sector: number,
    month: string,
  ): Promise<AuditSectorModel | null>;
  closeAuditSector(
    sector: number,
    month: string,
    supervisorId: string,
    observaciones?: string,
  ): Promise<CloseAuditSectorModel>;
  getAuditHistoryBySector(
    sector: number,
    months?: number,
  ): Promise<AuditSectorHistoryModel[]>;
}
