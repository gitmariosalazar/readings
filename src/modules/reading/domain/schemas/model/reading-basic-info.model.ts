export class ReadingBasicInfoModel {
  constructor(
    public readonly readingId: number,
    public readonly previousReadingDate: Date | null,
    public readonly cadastralKey: string,
    public readonly cardId: string,
    public readonly clientName: string,
    public readonly address: string,
    public readonly previousReading: number,
    public readonly currentReading: number | null,
    public readonly sector: number,
    public readonly account: number,
    public readonly readingValue: number,
    public readonly averageConsumption: number,
    public readonly meterNumber: string,
    public readonly rateId: number,
    public readonly rateName: string,
  ) {}
}
