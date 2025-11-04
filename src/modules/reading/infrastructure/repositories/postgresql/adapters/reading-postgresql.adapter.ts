import { ReadingBasicInfoResponse, ReadingInfoResponse } from "../../../../domain/schemas/dto/response/reading-basic.response";
import { ReadingResponse } from "../../../../domain/schemas/dto/response/reading.response";
import { ReadingBasicInfoSQLResult, ReadingInfoSQLResult, ReadingSQLResult } from "../../../interfaces/sql/reading-sql.result.interface";

export class ReadingPostgreSQLAdapter {
  static fromReadingPostgreSQLResultToReadingBasicInfoResponse(readingResultSQL: ReadingBasicInfoSQLResult): ReadingBasicInfoResponse {
    const response: ReadingBasicInfoResponse = {
      readingId: readingResultSQL.readingId,
      previousReadingDate: readingResultSQL.previousReadingDate,
      cadastralKey: readingResultSQL.cadastralKey,
      cardId: readingResultSQL.cardId,
      clientName: readingResultSQL.clientName,
      address: readingResultSQL.address,
      previousReading: readingResultSQL.previousReading,
      currentReading: readingResultSQL.currentReading,
      sector: readingResultSQL.sector,
      account: readingResultSQL.account,
      readingValue: readingResultSQL.readingValue,
      averageConsumption: readingResultSQL.averageConsumption,
      meterNumber: readingResultSQL.meterNumber,
      rateId: readingResultSQL.rateId,
      rateName: readingResultSQL.rateName
    }
    return response
  }

  static fromReadingPostgreSQLResultToReadingResponse(readingResultSQL: ReadingSQLResult): ReadingResponse {
    const response: ReadingResponse = {
      readingId: readingResultSQL.readingId,
      connectionId: readingResultSQL.connectionId,
      readingDate: readingResultSQL.readingDate,
      readingTime: readingResultSQL.readingTime,
      sector: readingResultSQL.sector,
      account: readingResultSQL.account,
      cadastralKey: readingResultSQL.cadastralKey,
      readingValue: readingResultSQL.readingValue,
      sewerRate: readingResultSQL.sewerRate,
      previousReading: readingResultSQL.previousReading,
      currentReading: readingResultSQL.currentReading,
      rentalIncomeCode: readingResultSQL.rentalIncomeCode,
      novelty: readingResultSQL.novelty,
      incomeCode: readingResultSQL.incomeCode
    }
    return response
  }

  static fromReadingPostgreSQLResultToReadingInfoResponse(readingResultSQL: ReadingInfoSQLResult): ReadingInfoResponse {
    const response: ReadingInfoResponse = {
      readingId: readingResultSQL.readingId,
      previousReadingDate: readingResultSQL.previousReadingDate,
      readingTime: readingResultSQL.readingTime,
      cadastralKey: readingResultSQL.cadastralKey,
      cardId: readingResultSQL.cardId,
      clientName: readingResultSQL.clientName,
      clientPhones: readingResultSQL.clientPhones,
      clientEmails: readingResultSQL.clientEmails,
      address: readingResultSQL.address,
      previousReading: readingResultSQL.previousReading,
      currentReading: readingResultSQL.currentReading,
      sector: readingResultSQL.sector,
      account: readingResultSQL.account,
      readingValue: readingResultSQL.readingValue,
      averageConsumption: readingResultSQL.averageConsumption,
      meterNumber: readingResultSQL.meterNumber,
      rateId: readingResultSQL.rateId,
      rateName: readingResultSQL.rateName,
      hasCurrentReading: readingResultSQL.hasCurrentReading
    }
    return response
  }
}