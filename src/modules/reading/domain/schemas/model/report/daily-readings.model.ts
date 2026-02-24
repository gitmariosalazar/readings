export class DailyReadingsReportModel {
  constructor(
    public readonly readingId: number,
    public readonly readingTime: string,
    public readonly cadastralKey: string,
    public readonly clientName: string,
    public readonly readingValue: number,
    public readonly consumption: number,
    public readonly novelty: string,
    public readonly averageConsumption: number,
    public readonly readerName?: string,
    public readonly previewReading?: number,
    public readonly currentReading?: number,
    public readonly clientId?: number,
  ) {}
}
