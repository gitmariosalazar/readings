export class ObservationDetailsModel {
  constructor(
    public readonly observationId: number,
    public readonly observationTitle: string,
    public readonly observationDetails: string,
    public readonly observationDate: string,
    public readonly readingId: number,
    public readonly connectionId: number,
    public readonly previousReading: number,
    public readonly currentReading: number,
    public readonly sector: number,
    public readonly account: number,
    public readonly cadastralKey: string,
    public readonly rentalIncomeCode: number,
    public readonly readingValue: number,
    public readonly noveltyReadingTypeId: number,
    public readonly noveltyTypeName: string,
    public readonly noveltyTypeDescription: string,
    public readonly clientId: string,
    public readonly address: string,
    public readonly clientName: string,
    public readonly observations: string,
  ) {}
}
