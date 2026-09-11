export interface ClientPhoneModel {
  telefonoid: number;
  numero: string;
}

export interface ClientEmailModel {
  emailid: number;
  email: string;
}

export interface ImagesModel {
  id: number;
  path: string;
  novelty: string;
}

export interface ObservationModel {
  id: number;
  title: string;
  observation: string;
}

export class ReadingInfoModel {
  constructor(
    public readonly readingId: number,
    public readonly previousReadingDate: Date | null,
    public readonly readingTime: Date | null,
    public readonly readingDate: Date | null,
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
    public readonly images?: ImagesModel[],
    public readonly observations?: ObservationModel[],
    public readonly readingLocation?: { lat: number; lng: number } | null,
  ) {}
}

export class ReadingDetailedModel {
  constructor(
    public readonly readingId: number,
    public readonly readingTime: Date | null,
    public readonly readingDate: Date | null,
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
    public readonly readingMonth: string,
    public readonly readingMonthName: string,
    public readonly novelty: string,
    public readonly consumption: number,
    public readonly startDatePeriod: Date,
    public readonly endDatePeriod: Date,
    public readonly connectionStateId: number,
    public readonly connectionStateName: string,
    public readonly connectionStateDescription: string,
    public readonly permitReading: boolean,
    public readonly connectionLocation?: { lat: number; lng: number } | null,
    public readonly images?: ImagesModel[],
    public readonly observations?: ObservationModel[],
    public readonly readingLocation?: { lat: number; lng: number } | null,
    public readonly userActions?: UserReadingActionAuditModel[],
  ) {}
}

/**
 export interface UserReadingActionAuditSqlResul {
  username: string | null;
  card_id: string | null;
  action: string | null;
  first_name: string | null;
  last_name: string | null;
  justification: string | null;
  previous_reading: number | null;
  new_reading: number | null;
  previous_consumption: number | null;
  new_consumption: number | null;
  approval_status: 'APROBADO' | 'RECHAZADO' | 'PENDIENTE' | string | null;
  adjustment_date: Date | null;
}
 */

export class UserReadingActionAuditModel {
  constructor(
    public readonly username: string | null,
    public readonly cardId: string | null,
    public readonly action: string | null,
    public readonly firstName: string | null,
    public readonly lastName: string | null,
    public readonly justification: string | null,
    public readonly previousReading: number | null,
    public readonly newReading: number | null,
    public readonly previousConsumption: number | null,
    public readonly newConsumption: number | null,
    public readonly approvalStatus:
      | 'APROBADO'
      | 'RECHAZADO'
      | 'PENDIENTE'
      | string
      | null,
    public readonly adjustmentDate: Date | null,
  ) {}
}
