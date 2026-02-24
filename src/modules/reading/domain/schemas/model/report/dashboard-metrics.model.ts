export class NoveltyDistributionModel {
  constructor(
    public readonly novelty: string,
    public readonly count: number,
  ) {}
}

export class DashboardMetricsModel {
  constructor(
    public readonly totalReadingsToday: number,
    public readonly pendingReadingsToday: number,
    public readonly readingsWithNoveltyToday: number,
    public readonly efficiencyPercentage: number,
    public readonly noveltyDistribution: NoveltyDistributionModel[],
  ) {}
}
