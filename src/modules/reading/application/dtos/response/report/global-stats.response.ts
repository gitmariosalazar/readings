export interface GlobalStatsReportResponse {
  totalReadings: number;
  readingsWithData: number; // days_with_readings
  averageReadingsPerDay: number;
  averageReadingValue: number;
  totalReadingValue: number;
  minReadingValue: number;
  maxReadingValue: number;
  averageSewerRate: number;
  totalSewerRate: number;
  averageConsumption: number;
  totalConsumption: number;
  uniqueSectors: number;
  uniqueConnections: number;
  uniqueCadastralKeys: number;
  countNonNullReadingValue: number;
  countNonNullSewerRate: number;
  totalConnections: number;
}
