export interface MonthlySummaryResponse {
  month: number;
  totalReadings: number;
  averageConsumption: number;
}

export interface YearlyReadingsReportResponse {
  year: number;
  totalReadings: number;
  averageConsumption: number;
  monthlySummaries: MonthlySummaryResponse[];
}
