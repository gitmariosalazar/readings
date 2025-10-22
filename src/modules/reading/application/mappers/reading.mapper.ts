import { CreateReadingRequest } from "../../domain/schemas/dto/request/create-reading.request";
import { UpdateReadingRequest } from "../../domain/schemas/dto/request/update-reading.request";
import { ReadingModel } from "../../domain/schemas/model/reading.model";

export class ReadingMapper {
  static fromCreateReadingRequestToReadingModel(
    readingRequest: CreateReadingRequest
  ): ReadingModel {
    const readingModel: ReadingModel = new ReadingModel()
    readingModel.setConnectionId(readingRequest.connectionId);
    readingModel.setCadastralKey(readingRequest.cadastralKey)
    readingModel.setIncomeCode(readingRequest.incomeCode)
    readingModel.setAccount(readingRequest.account)
    readingModel.setSector(readingRequest.sector)
    readingModel.setPreviousReading(readingRequest.previousReading)
    readingModel.setSewerRate(readingRequest.sewerRate)
    readingModel.setCurrentReading(readingRequest.currentReading ?? 0)
    readingModel.setReadingDate(readingRequest.readingDate)
    readingModel.setReadingTime(readingRequest.readingTime)
    readingModel.setReadingValue(0)
    readingModel.setRentalIncomeCode(readingRequest.rentalIncomeCode ?? 0)
    readingModel.setNovelty(readingRequest.novelty ?? 'NORMAL')
    readingModel.setTipoNovedadLecturaId(readingRequest.typeNoveltyReadingId ?? 1)
    return readingModel;
  }

  static fromUpdateReadingRequestToReadingModel(
    readingRequest: UpdateReadingRequest
  ): ReadingModel {
    const readingModel: ReadingModel = new ReadingModel()
    readingModel.setReadingId(readingRequest.readingId);
    readingModel.setConnectionId(readingRequest.connectionId);
    readingModel.setCadastralKey(readingRequest.cadastralKey)
    readingModel.setIncomeCode(readingRequest.incomeCode ?? 0)
    readingModel.setRentalIncomeCode(readingRequest.rentalIncomeCode ?? 0)
    readingModel.setAccount(readingRequest.account)
    readingModel.setSector(readingRequest.sector)
    const date: Date = new Date();
    readingModel.setReadingDate(date)
    const hour: string = date.getTime().toLocaleString();
    readingModel.setReadingTime(hour)
    readingModel.setCurrentReading(readingRequest.currentReading ?? 0)
    readingModel.setPreviousReading(readingRequest.previousReading ?? 0)
    readingModel.setNovelty(readingRequest.novelty ?? 'NORMAL')
    readingModel.setSewerRate(readingRequest.sewerRate ?? 0)
    readingModel.setReadingValue(readingRequest.readingValue ?? 0)
    return readingModel;
  }
}