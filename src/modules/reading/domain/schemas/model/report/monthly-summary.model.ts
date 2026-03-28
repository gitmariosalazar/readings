export class MonthlySummaryModel {
  constructor(
    public readonly month: string,
    public readonly totalReadings: number,
    public readonly totalConsumption: number,
    public readonly averageConsumption: number,
    public readonly maxConsumption: number,
    public readonly minConsumption: number,
    public readonly incidentCount: number,
    public readonly incidentRatePercentage: number,
  ) {}
}
