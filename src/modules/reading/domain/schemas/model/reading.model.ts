export class ReadingModel {
  constructor(
    public readonly id: number,
    public readonly connectionId: string,
    public readonly readingDate: Date,
    public readonly readingTime: string,
    public readonly sector: number,
    public readonly account: number,
    public readonly cadastralKey: string,
    public readonly readingValue: number,
    public readonly sewerRate: number,
    public readonly previousReading: number,
    public readonly currentReading: number,
    public readonly rentalIncomeCode: number | null,
    public readonly novelty: string | null,
    public readonly incomeCode: number | null,
    public readonly typeNoveltyReadingId: number,
    public readonly currentMonthReading: string,
    public readonly locationCapture: { lat: number; lng: number } | null,
    public readonly readingCode: string,
  ) {}

  // Domain logic
  public calculateConsumption(): number {
    return this.currentReading - this.previousReading;
  }
}

export class ReadingNoveltyModel {
  constructor(
    public readonly readingId: number,
    public readonly readingDate: Date | null,
    public readonly readingMonth: string,
    public readonly readingTime: string | null,
    public readonly cadastralKey: string,
    public readonly meterNumber: string,
    public readonly address: string,
    public readonly sector: number,
    public readonly account: number,
    public readonly clientName: string,
    public readonly locationCapture: { lat: number; lng: number } | null,
    public readonly cardId: string,
    public readonly previousReading: number,
    public readonly currentReading: number | null,
    public readonly readingValue: number | null,
    public readonly calculatedConsumption: number | null,
    public readonly averageConsumption: number | null,
    public readonly rateName: string,
    public readonly readingTypeId: number,
    public readonly readingTypeName: string,
    public readonly novelty: string,
    public readonly noveltyTypeId: number | null,
    public readonly noveltyTypeName: string | null,
    public readonly noveltyTypeDescription: string | null,
    public readonly images: string[],
    public readonly locationConnection?: { lat: number; lng: number } | null,
    public readonly distanceMeters?: number | null,
    public readonly isInsideAllowedRadius?: boolean | null,
    public readonly distanceLineGeoJSON?: any | null,
    public readonly readingCode?: string | null,
  ) {}
}
