export interface NoveltyDistributionResponse {
  novelty: string;
  count: number;
}

export interface DashboardMetricsResponse {
  totalReadingsToday: number;
  pendingReadingsToday: number;
  readingsWithNoveltyToday: number;
  efficiencyPercentage: number;
  noveltyDistribution: NoveltyDistributionResponse[];
}
