export interface ClientPhoneModel {
  telefonoid: number;
  numero: string;
}

export interface ClientEmailModel {
  emailid: number;
  email: string;
}

export class ReadingInfoModel {
  constructor(
    public readonly readingId: number,
    public readonly previousReadingDate: Date | null,
    public readonly readingTime: Date | null,
    public readonly cadastralKey: string,
    public readonly cardId: string,
    public readonly clientName: string,
    public readonly clientPhones: ClientPhoneModel[],
    public readonly clientEmails: ClientEmailModel[],
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
    public readonly hasCurrentReading: boolean,
    public readonly monthReading: string,
    public readonly startDatePeriod: Date,
    public readonly endDatePeriod: Date,
    public readonly connectionStateId: number,
    public readonly connectionStateName: string,
    public readonly connectionStateDescription: string,
    public readonly permitReading: boolean,
    public readonly connectionLocation?: { lat: number; lng: number } | null,
  ) {}
}
