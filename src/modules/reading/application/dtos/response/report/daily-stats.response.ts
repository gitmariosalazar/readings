export interface DailyStatsReportResponse {
  date: string;
  readingsCount: number;
  totalReadingValue: number;
  averageReadingValue: number;
  minReadingValue: number;
  maxReadingValue: number;
  averageSewerRate: number;
  averageConsumption: number;
  uniqueSectors: number;
  uniqueConnections: number;
}
