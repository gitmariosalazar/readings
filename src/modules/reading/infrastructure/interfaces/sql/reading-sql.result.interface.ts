export interface ReadingBasicInfoSQLResult {
  readingId: number
  previousReadingDate: Date | null
  cadastralKey: string
  cardId: string
  clientName: string
  address: string
  previousReading: number
  currentReading: number | null
  sector: number
  account: number
  readingValue: number
  averageConsumption: number
  meterNumber: string
  rateId: number
  rateName: string
}

export interface ReadingSQLResult {
  readingId: number
  connectionId: string
  readingDate: Date | null
  readingTime: string | null
  sector: number
  account: number
  cadastralKey: string
  readingValue: number | null
  sewerRate: number | null
  previousReading: number | null
  currentReading: number | null
  rentalIncomeCode: number | null
  novelty: string | null
  incomeCode: number | null
  averageConsumption: number
}

export interface ClientPhoneSQLResult {
  telefonoid: number
  numero: string
}

export interface ClientEmailSQLResult {
  emailid: number
  email: string
}

export interface ReadingInfoSQLResult {
  readingId: number
  previousReadingDate: Date | null
  readingTime: Date | null
  cadastralKey: string
  cardId: string
  clientName: string
  clientPhones: ClientPhoneSQLResult[]
  clientEmails: ClientEmailSQLResult[]
  address: string
  previousReading: number
  currentReading: number | null
  sector: number
  account: number
  readingValue: number
  averageConsumption: number
  meterNumber: string
  rateId: number
  rateName: string,
  hasCurrentReading: boolean
  monthReading: string
  startDatePeriod: Date
  endDatePeriod: Date
}