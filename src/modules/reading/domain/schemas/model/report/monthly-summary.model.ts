export class MonthlySummaryModel {
  constructor(
    public readonly month: string,
    public readonly totalReadings: number,
    public readonly totalConsumption: number,
  ) {}
}
