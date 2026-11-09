export class MonthlyTrendModel {
  constructor(
    public readonly readingMonth: string,
    public readonly totalReadings: number,
    public readonly totalVolumeM3: number,
    public readonly deltaVolumeM3: number | null,
    public readonly growthVolumePercentage: number | null,
    public readonly waterBilledUsd: number,
    public readonly sewerBilledUsd: number,
    public readonly totalBilledUsd: number,
    public readonly deltaRevenueUsd: number | null,
    public readonly growthRevenuePercentage: number | null,
  ) {}
}
