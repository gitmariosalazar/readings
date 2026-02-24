export class SectorStatsReportModel {
  constructor(
    public readonly sector: number,
    public readonly readingsCount: number,
    public readonly totalReadingValue: number,
    public readonly averageReadingValue: number,
    public readonly averageSewerRate: number,
    public readonly averageConsumption: number,
    public readonly activeDays: number,
  ) {}
}
