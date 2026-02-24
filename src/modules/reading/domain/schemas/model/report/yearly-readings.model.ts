import { MonthlySummaryModel } from './monthly-summary.model';

export class YearlyReadingsReportModel {
  constructor(
    public readonly year: number,
    public readonly totalReadings: number,
    public readonly averageConsumption: number,
    public readonly monthlySummaries: MonthlySummaryModel[],
  ) {}
}
