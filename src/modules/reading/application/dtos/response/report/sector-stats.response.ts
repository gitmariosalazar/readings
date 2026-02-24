export interface SectorStatsReportResponse {
  sector: number;
  readingsCount: number;
  totalReadingValue: number;
  averageReadingValue: number;
  averageSewerRate: number;
  averageConsumption: number;
  activeDays: number;
}
