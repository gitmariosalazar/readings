export class NoveltyStatsReportModel {
  constructor(
    public readonly novelty: string,
    public readonly count: number,
    public readonly averageReadingValue: number,
    public readonly averageConsumption: number,
    public readonly totalReadingValue: number,
  ) {}
}
