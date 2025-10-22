import { ReadingBasicInfoResponse } from "src/modules/reading/domain/schemas/dto/response/reading-basic.response";
import { ReadingBasicInfoSQLResult, ReadingSQLResult } from "../../../interfaces/sql/reading-sql.result.interface";
import { ReadingResponse } from "src/modules/reading/domain/schemas/dto/response/reading.response";

export class ReadingPostgreSQLAdapter {
  static fromReadingPostgreSQLResultToReadingBasicInfoResponse(readingResultSQL: ReadingBasicInfoSQLResult): ReadingBasicInfoResponse {
    const response: ReadingBasicInfoResponse = {
      readingId: readingResultSQL.readingId,
      previousReadingDate: readingResultSQL.previousReadingDate,
      cadastralKey: readingResultSQL.catastralCode,
      cardId: readingResultSQL.cardId,
      clientName: readingResultSQL.clientName,
      address: readingResultSQL.address,
      previousReading: readingResultSQL.previousReading,
      currentReading: readingResultSQL.currentReading,
      sector: readingResultSQL.sector,
      account: readingResultSQL.account,
      readingValue: readingResultSQL.readingValue,
      averageConsumption: readingResultSQL.averageConsumption
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
}