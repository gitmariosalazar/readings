export class DailyStatsReportModel {
  constructor(
    public readonly date: string,
    public readonly readingsCount: number,
    public readonly totalReadingValue: number,
    public readonly averageReadingValue: number,
    public readonly minReadingValue: number,
    public readonly maxReadingValue: number,
    public readonly averageSewerRate: number,
    public readonly averageConsumption: number,
    public readonly uniqueSectors: number,
    public readonly uniqueConnections: number,
  ) {}
}
