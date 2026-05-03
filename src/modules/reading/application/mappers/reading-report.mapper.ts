import { AdvancedReportReadingsModel } from '../../domain/schemas/model/report/advanced-report-readings.model';
import { ConnectionLastReadingsReportModel } from '../../domain/schemas/model/report/connection-last-readings.model';
import { DailyReadingsReportModel } from '../../domain/schemas/model/report/daily-readings.model';
import { DailyStatsReportModel } from '../../domain/schemas/model/report/daily-stats.model';
import { DashboardMetricsModel } from '../../domain/schemas/model/report/dashboard-metrics.model';
import { GlobalStatsReportModel } from '../../domain/schemas/model/report/global-stats.model';
import { NoveltyStatsReportModel } from '../../domain/schemas/model/report/novelty-stats.model';
import { SectorStatsReportModel } from '../../domain/schemas/model/report/sector-stats.model';
import { YearlyReadingsReportModel } from '../../domain/schemas/model/report/yearly-readings.model';

import { AdvancedReportReadingsResponse } from '../dtos/response/report/advanced-report-readings.response';
import { ConnectionLastReadingsReportResponse } from '../dtos/response/report/connection-last-readings.response';
import { DailyReadingsReportResponse } from '../dtos/response/report/daily-readings.response';
import { DailyStatsReportResponse } from '../dtos/response/report/daily-stats.response';
import { DashboardMetricsResponse } from '../dtos/response/report/dashboard-metrics.response';
import { GlobalStatsReportResponse } from '../dtos/response/report/global-stats.response';
import { NoveltyStatsReportResponse } from '../dtos/response/report/novelty-stats.response';
import { SectorStatsReportResponse } from '../dtos/response/report/sector-stats.response';
import { YearlyReadingsReportResponse } from '../dtos/response/report/yearly-readings.response';

export class ReadingReportMapper {
  static toAdvancedReportReadingsResponseList(
    models: AdvancedReportReadingsModel[],
  ): AdvancedReportReadingsResponse[] {
    return models.map((model) => ({
      sector: model.sector,
      totalConnections: model.totalConnections,
      readingsCompleted: model.readingsCompleted,
      missingReadings: model.missingReadings,
      progressPercentage: model.progressPercentage,
      pureActiveUnits: model.pureActiveUnits,
      suspendedOrArrearsWithReading: model.suspendedOrArrearsWithReading,
      dataDiscrepancy: model.dataDiscrepancy,
      totalVisitEfficiency: model.totalVisitEfficiency,
    }));
  }

  static toConnectionLastReadingsReportResponseList(
    models: ConnectionLastReadingsReportModel[],
  ): ConnectionLastReadingsReportResponse[] {
    return models.map((model) => ({
      readingId: model.readingId,
      readingDate: model.readingDate,
      readingValue: model.readingValue,
      consumption: model.consumption,
      clientName: model.clientName,
      cadastralKey: model.cadastralKey,
      meterNumber: model.meterNumber,
      address: model.address,
      novelty: model.novelty,
      averageConsumption: model.averageConsumption,
      readerName: model.readerName,
      previewReading: model.previewReading,
      currentReading: model.currentReading,
      clientId: model.clientId,
    }));
  }

  static toDailyReadingsReportResponseList(
    models: DailyReadingsReportModel[],
  ): DailyReadingsReportResponse[] {
    return models.map((model) => ({
      readingId: model.readingId,
      readingTime: model.readingTime,
      cadastralKey: model.cadastralKey,
      clientName: model.clientName,
      readingValue: model.readingValue,
      consumption: model.consumption,
      novelty: model.novelty,
      averageConsumption: model.averageConsumption,
      readerName: model.readerName,
      previewReading: model.previewReading,
      currentReading: model.currentReading,
      clientId: model.clientId,
    }));
  }

  static toDailyStatsReportResponseList(
    models: DailyStatsReportModel[],
  ): DailyStatsReportResponse[] {
    return models.map((model) => ({
      date: model.date,
      readingsCount: model.readingsCount,
      totalReadingValue: model.totalReadingValue,
      averageReadingValue: model.averageReadingValue,
      minReadingValue: model.minReadingValue,
      maxReadingValue: model.maxReadingValue,
      averageSewerRate: model.averageSewerRate,
      averageConsumption: model.averageConsumption,
      uniqueSectors: model.uniqueSectors,
      uniqueConnections: model.uniqueConnections,
    }));
  }

  static toDashboardMetricsResponse(
    model: DashboardMetricsModel,
  ): DashboardMetricsResponse {
    return {
      totalReadingsToday: model.totalReadingsToday,
      pendingReadingsToday: model.pendingReadingsToday,
      readingsWithNoveltyToday: model.readingsWithNoveltyToday,
      efficiencyPercentage: model.efficiencyPercentage,
      noveltyDistribution: model.noveltyDistribution.map((n) => ({
        novelty: n.novelty,
        count: n.count,
      })),
    };
  }

  static toGlobalStatsReportResponse(
    model: GlobalStatsReportModel,
  ): GlobalStatsReportResponse {
    return {
      totalReadings: model.totalReadings,
      readingsWithData: model.readingsWithData,
      averageReadingsPerDay: model.averageReadingsPerDay,
      averageReadingValue: model.averageReadingValue,
      totalReadingValue: model.totalReadingValue,
      minReadingValue: model.minReadingValue,
      maxReadingValue: model.maxReadingValue,
      averageSewerRate: model.averageSewerRate,
      totalSewerRate: model.totalSewerRate,
      averageConsumption: model.averageConsumption,
      totalConsumption: model.totalConsumption,
      uniqueSectors: model.uniqueSectors,
      uniqueConnections: model.uniqueConnections,
      uniqueCadastralKeys: model.uniqueCadastralKeys,
      countNonNullReadingValue: model.countNonNullReadingValue,
      countNonNullSewerRate: model.countNonNullSewerRate,
      totalConnections: model.totalConnections,
    };
  }

  static toNoveltyStatsReportResponseList(
    models: NoveltyStatsReportModel[],
  ): NoveltyStatsReportResponse[] {
    return models.map((model) => ({
      novelty: model.novelty,
      count: model.count,
      averageReadingValue: model.averageReadingValue,
      averageConsumption: model.averageConsumption,
      totalReadingValue: model.totalReadingValue,
    }));
  }

  static toSectorStatsReportResponseList(
    models: SectorStatsReportModel[],
  ): SectorStatsReportResponse[] {
    return models.map((model) => ({
      sector: model.sector,
      readingsCount: model.readingsCount,
      totalReadingValue: model.totalReadingValue,
      averageReadingValue: model.averageReadingValue,
      averageSewerRate: model.averageSewerRate,
      averageConsumption: model.averageConsumption,
      activeDays: model.activeDays,
    }));
  }

  static toYearlyReadingsReportResponse(
    model: YearlyReadingsReportModel,
  ): YearlyReadingsReportResponse {
    return {
      year: model.year,
      totalReadings: model.totalReadings,
      averageConsumption: model.averageConsumption,
      monthlySummaries: model.monthlySummaries.map((m) => ({
        month: m.month,
        totalReadings: m.totalReadings,
        totalConsumption: m.totalConsumption,
        averageConsumption: m.averageConsumption,
        maxConsumption: m.maxConsumption,
        minConsumption: m.minConsumption,
        incidentCount: m.incidentCount,
        incidentRatePercentage: m.incidentRatePercentage,
      })),
    };
  }
}
