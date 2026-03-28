export interface MonthlySummaryResponse {
  month: string;
  totalReadings: number;
  totalConsumption: number;
  averageConsumption: number;
  maxConsumption: number;
  minConsumption: number;
  incidentCount: number;
  incidentRatePercentage: number;
}

export interface YearlyReadingsReportResponse {
  year: number;
  totalReadings: number;
  averageConsumption: number;
  monthlySummaries: MonthlySummaryResponse[];
}
