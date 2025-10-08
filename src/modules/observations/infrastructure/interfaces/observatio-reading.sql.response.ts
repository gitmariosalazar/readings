export interface ObservationReadingSQLResponse {
  observationReadingId: number
  readingId: number
  observationId: number
  observationTitle: string;
  observationDetails: string;
}

export interface ObservationSQLResult {
  observationId: number
  observationTitle: string;
  observationDetails: string;
}

export interface ObservationReadingSQLResult {
  observationReadingId: number
  observationId: number
  readingId: number;
  registerDate: string;
}

export interface ObservationDetailsSQLResponse {
  observationId: number
  observationTitle: string;
  observationDetails: string;
  observationDate: string;
  readingId: number
  connectionId: number
  previousReading: number
  currentReading: number
  sector: number
  account: number
  cadastralKey: string
  rentalIncomeCode: number
  readingValue: number
  noveltyReadingTypeId: number
  noveltyTypeName: string
  noveltyTypeDescription: string
  clientId: string
  address: string
  clientName: string
  observations: string
}
