export class ConnectionLastReadingsReportModel {
  constructor(
    public readonly readingId: number,
    public readonly readingDate: Date,
    public readonly readingValue: number,
    public readonly consumption: number,
    public readonly clientName: string,
    public readonly cadastralKey: string,
    public readonly meterNumber: string,
    public readonly address: string,
    public readonly novelty: string,
    public readonly averageConsumption: number,
    public readonly readerName?: string,
    public readonly previewReading?: number,
    public readonly currentReading?: number,
    public readonly clientId?: number,
  ) {}
}
