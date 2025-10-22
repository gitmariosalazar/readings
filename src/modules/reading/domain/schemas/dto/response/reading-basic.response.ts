export interface ReadingBasicInfoResponse {
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
}