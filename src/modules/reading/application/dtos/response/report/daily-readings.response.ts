export interface DailyReadingsReportResponse {
  readingId: number;
  readingTime: string;
  cadastralKey: string;
  clientName: string;
  readingValue: number;
  consumption: number;
  novelty: string;
  averageConsumption: number;
  readerName?: string;
  previewReading?: number;
  currentReading?: number;
  clientId?: number;
}
