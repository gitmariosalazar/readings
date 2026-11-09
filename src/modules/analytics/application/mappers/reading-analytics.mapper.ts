import { ExecutiveDashboardModel } from '../../domain/schemas/model/executive-dashboard.model';
import { SectorPerformanceModel } from '../../domain/schemas/model/sector-performance.model';
import { MonthlyTrendModel } from '../../domain/schemas/model/monthly-trend.model';
import { NoveltyEconomicImpactModel } from '../../domain/schemas/model/novelty-economic-impact.model';
import { TopConsumerModel } from '../../domain/schemas/model/top-consumer.model';
import { InterannualComparisonModel } from '../../domain/schemas/model/interannual-comparison.model';

import { ExecutiveDashboardResponse } from '../dtos/response/executive-dashboard.response';
import { SectorPerformanceResponse } from '../dtos/response/sector-performance.response';
import { MonthlyTrendResponse } from '../dtos/response/monthly-trend.response';
import { NoveltyEconomicImpactResponse } from '../dtos/response/novelty-economic-impact.response';
import { TopConsumerResponse } from '../dtos/response/top-consumer.response';
import { InterannualComparisonResponse } from '../dtos/response/interannual-comparison.response';

export class ReadingAnalyticsMapper {
  static toExecutiveDashboardResponse(
    model: ExecutiveDashboardModel,
  ): ExecutiveDashboardResponse {
    return {
      analyzedPeriod: model.analyzedPeriod,
      totalReadingsTaken: model.totalReadingsTaken,
      totalSectorsCovered: model.totalSectorsCovered,
      totalActiveConnections: model.totalActiveConnections,
      totalVolumeM3: model.totalVolumeM3,
      averageConsumptionPerAccountM3: model.averageConsumptionPerAccountM3,
      minConsumptionM3: model.minConsumptionM3,
      maxConsumptionM3: model.maxConsumptionM3,
      waterBilledUsd: model.waterBilledUsd,
      sewerBilledUsd: model.sewerBilledUsd,
      totalBilledUsd: model.totalBilledUsd,
      averageTicketPerAccountUsd: model.averageTicketPerAccountUsd,
      weightedAverageEffectiveTariffUsdPerM3: model.weightedAverageEffectiveTariffUsdPerM3,
      totalReadingsWithNovelty: model.totalReadingsWithNovelty,
      operativeNoveltyPercentage: model.operativeNoveltyPercentage,
    };
  }

  static toSectorPerformanceResponseList(
    models: SectorPerformanceModel[],
  ): SectorPerformanceResponse[] {
    return models.map((model) => ({
      sector: model.sector,
      totalReadings: model.totalReadings,
      consumedVolumeM3: model.consumedVolumeM3,
      averageConsumptionM3: model.averageConsumptionM3,
      waterBilledUsd: model.waterBilledUsd,
      sewerBilledUsd: model.sewerBilledUsd,
      totalBilledUsd: model.totalBilledUsd,
      revenueSharePercentage: model.revenueSharePercentage,
      volumeSharePercentage: model.volumeSharePercentage,
      averageTariffUsdPerM3: model.averageTariffUsdPerM3,
      noveltiesCount: model.noveltiesCount,
      noveltyPercentage: model.noveltyPercentage,
      revenueRank: model.revenueRank,
      volumeRank: model.volumeRank,
    }));
  }

  static toMonthlyTrendResponseList(
    models: MonthlyTrendModel[],
  ): MonthlyTrendResponse[] {
    return models.map((model) => ({
      readingMonth: model.readingMonth,
      totalReadings: model.totalReadings,
      totalVolumeM3: model.totalVolumeM3,
      deltaVolumeM3: model.deltaVolumeM3,
      growthVolumePercentage: model.growthVolumePercentage,
      waterBilledUsd: model.waterBilledUsd,
      sewerBilledUsd: model.sewerBilledUsd,
      totalBilledUsd: model.totalBilledUsd,
      deltaRevenueUsd: model.deltaRevenueUsd,
      growthRevenuePercentage: model.growthRevenuePercentage,
    }));
  }

  static toNoveltyEconomicImpactResponseList(
    models: NoveltyEconomicImpactModel[],
  ): NoveltyEconomicImpactResponse[] {
    return models.map((model) => ({
      novelty: model.novelty,
      casesCount: model.casesCount,
      shareOfTotalReadingsPercentage: model.shareOfTotalReadingsPercentage,
      totalVolumeM3: model.totalVolumeM3,
      averageVolumePerCaseM3: model.averageVolumePerCaseM3,
      waterBilledUsd: model.waterBilledUsd,
      sewerBilledUsd: model.sewerBilledUsd,
      totalBilledUsd: model.totalBilledUsd,
    }));
  }

  static toTopConsumerResponseList(
    models: TopConsumerModel[],
  ): TopConsumerResponse[] {
    return models.map((model) => ({
      readingId: model.readingId,
      sector: model.sector,
      account: model.account,
      cadastralKey: model.cadastralKey,
      connectionId: model.connectionId,
      meterNumber: model.meterNumber,
      address: model.address,
      clientName: model.clientName,
      previousReading: model.previousReading,
      currentReading: model.currentReading,
      consumedVolumeM3: model.consumedVolumeM3,
      waterBilledUsd: model.waterBilledUsd,
      sewerBilledUsd: model.sewerBilledUsd,
      totalBilledUsd: model.totalBilledUsd,
      novelty: model.novelty,
      readingDate: model.readingDate,
      gpsCoordinates: model.gpsCoordinates,
    }));
  }

  static toInterannualComparisonResponseList(
    models: InterannualComparisonModel[],
  ): InterannualComparisonResponse[] {
    return models.map((model) => ({
      sector: model.sector,
      homologousAccountsCount: model.homologousAccountsCount,
      readingsBaseYear: model.readingsBaseYear,
      readingsTargetYear: model.readingsTargetYear,
      deltaReadings: model.deltaReadings,
      volumeBaseYearM3: model.volumeBaseYearM3,
      volumeTargetYearM3: model.volumeTargetYearM3,
      deltaVolumeM3: model.deltaVolumeM3,
      varianceVolumePercentage: model.varianceVolumePercentage,
      billedBaseYearUsd: model.billedBaseYearUsd,
      billedTargetYearUsd: model.billedTargetYearUsd,
      deltaBilledUsd: model.deltaBilledUsd,
      varianceBilledPercentage: model.varianceBilledPercentage,
      managementDiagnostic: model.managementDiagnostic,
    }));
  }
}
