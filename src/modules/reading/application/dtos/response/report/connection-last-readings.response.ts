export interface ConnectionLastReadingsReportResponse {
  readingId: number;
  readingDate: Date;
  readingValue: number;
  consumption: number;
  clientName: string;
  cadastralKey: string;
  meterNumber: string;
  address: string;
  novelty: string;
  averageConsumption: number;
  readerName?: string;
  previewReading?: number;
  currentReading?: number;
  clientId?: number;
}
