export interface ReadingBasicInfoSQLResult {
  readingId: number
  previousReadingDate: Date | null
  catastralCode: string
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