export class GlobalStatsReportModel {
  constructor(
    public readonly totalReadings: number,
    public readonly readingsWithData: number, // days_with_readings
    public readonly averageReadingsPerDay: number,
    public readonly averageReadingValue: number,
    public readonly totalReadingValue: number,
    public readonly minReadingValue: number,
    public readonly maxReadingValue: number,
    public readonly averageSewerRate: number,
    public readonly totalSewerRate: number,
    public readonly averageConsumption: number,
    public readonly totalConsumption: number,
    public readonly uniqueSectors: number,
    public readonly uniqueConnections: number,
    public readonly uniqueCadastralKeys: number,
    public readonly countNonNullReadingValue: number,
    public readonly countNonNullSewerRate: number,
    public readonly totalConnections: number,
  ) {}
}
