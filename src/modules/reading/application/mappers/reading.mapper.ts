import { CreateReadingRequest } from '../dtos/request/create-reading.request';
import { UpdateReadingRequest } from '../dtos/request/update-reading.request';
import {
  ReadingModel,
  ReadingNoveltyModel,
} from '../../domain/schemas/model/reading.model';
import {
  MonthlySummaryResponse,
  PendingReadingConnectionResponse,
  ReadingNoveltyResponse,
  ReadingResponse,
  TakenReadingConnectionResponse,
} from '../dtos/response/reading.response';
import { ReadingHistoryModel } from '../../domain/schemas/model/reading-history.model';
import { ReadingHistoryResponse } from '../dtos/response/reading-history.response';
import { ReadingImagesModel } from '../../domain/schemas/model/reading-images.model';
import { ReadingImagesResponse } from '../dtos/response/reading-images.response';
import { PendingReadingConnectionModel } from '../../domain/schemas/model/pending-reading-connection.model';
import { TakenReadingConnectionModel } from '../../domain/schemas/model/taken-reading-connection.model';
import { MonthlySummaryModel } from '../../domain/schemas/model/report/monthly-summary.model';

export class ReadingMapper {
  static fromCreateReadingRequestToReadingModel(
    readingRequest: CreateReadingRequest,
  ): ReadingModel {
    const [year, month] = readingRequest.previousMonthReading
      .split('-')
      .map(Number);
    const nextDate = new Date(year, month - 1 + 1, 1);
    const currentMonthReading = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}`;

    return new ReadingModel(
      0, // ID
      readingRequest.connectionId,
      readingRequest.readingDate,
      readingRequest.readingTime,
      readingRequest.sector,
      readingRequest.account,
      readingRequest.cadastralKey,
      0, // readingValue
      readingRequest.sewerRate,
      readingRequest.previousReading,
      readingRequest.currentReading ?? 0,
      readingRequest.rentalIncomeCode ?? 0,
      readingRequest.novelty ?? 'NORMAL',
      readingRequest.incomeCode,
      readingRequest.typeNoveltyReadingId ?? 1,
      currentMonthReading,
    );
  }

  static fromUpdateReadingRequestToReadingModel(
    readingRequest: UpdateReadingRequest,
  ): ReadingModel {
    const date: Date = new Date();
    const hour: string = date.getTime().toLocaleString();

    return new ReadingModel(
      readingRequest.readingId,
      readingRequest.connectionId,
      date, // readingDate
      hour, // readingTime
      readingRequest.sector,
      readingRequest.account,
      readingRequest.cadastralKey,
      readingRequest.readingValue ?? 0,
      readingRequest.sewerRate ?? 0,
      readingRequest.previousReading ?? 0,
      readingRequest.currentReading ?? 0,
      readingRequest.rentalIncomeCode ?? 0,
      readingRequest.novelty ?? 'NORMAL',
      readingRequest.incomeCode ?? 0,
      readingRequest.typeNoveltyReadingId ?? 1,
      '', // currentMonthReading (default or needs to be in request)
    );
  }
  static fromReadingModelToReadingResponse(
    reading: ReadingModel,
  ): ReadingResponse {
    const response: ReadingResponse = {
      readingId: reading.id,
      connectionId: reading.connectionId,
      readingDate: reading.readingDate,
      readingTime: reading.readingTime,
      sector: reading.sector,
      account: reading.account,
      cadastralKey: reading.cadastralKey,
      readingValue: reading.readingValue,
      sewerRate: reading.sewerRate,
      previousReading: reading.previousReading,
      currentReading: reading.currentReading,
      rentalIncomeCode: reading.rentalIncomeCode ?? 0,
      novelty: reading.novelty ?? '',
      incomeCode: reading.incomeCode ?? 0,
    };
    return response;
  }

  static fromReadingHistoryModelToReadingHistoryResponse(
    readingHistory: ReadingHistoryModel,
  ): ReadingHistoryResponse {
    const response: ReadingHistoryResponse = {
      readingId: readingHistory.readingId,
      connectionId: readingHistory.connectionId,
      readingYear: readingHistory.readingYear,
      readingMonth: readingHistory.readingMonth,
      readingDate: readingHistory.readingDate,
      readingTime: readingHistory.readingTime,
      previousReading: readingHistory.previousReading,
      currentReading: readingHistory.currentReading,
      consumption: readingHistory.consumption,
      observation: readingHistory.observation,
    };
    return response;
  }

  static fromReadingImagesModelToReadingImagesResponse(
    readingImages: ReadingImagesModel,
  ): ReadingImagesResponse {
    const response: ReadingImagesResponse = {
      cadastralKey: readingImages.cadastralKey,
      readingId: readingImages.readingId,
      previewsReading: readingImages.previewsReading,
      currentReading: readingImages.currentReading,
      images: readingImages.images,
      readingMonth: readingImages.readingMonth,
      readingYear: readingImages.readingYear,
      readingMonthName: readingImages.readingMonthName,
      novelty: readingImages.novelty,
      consumption: readingImages.consumption,
      observation: readingImages.observation,
    };
    return response;
  }

  static fromPendingReadingConnectionModelToPendingReadingConnectionResponse(
    pendingReadingConnection: PendingReadingConnectionModel,
  ): PendingReadingConnectionResponse {
    const response: PendingReadingConnectionResponse = {
      cadastralKey: pendingReadingConnection.cadastralKey,
      meterNumber: pendingReadingConnection.meterNumber,
      address: pendingReadingConnection.address,
      sector: pendingReadingConnection.sector,
      account: pendingReadingConnection.account,
      clientName: pendingReadingConnection.clientName,
      cardId: pendingReadingConnection.cardId,
      rateName: pendingReadingConnection.rateName,
      averageConsumption: pendingReadingConnection.averageConsumption ?? 0,
    };
    return response;
  }

  static fromTakenReadingConnectionModelToTakenReadingConnectionResponse(
    takenReadingConnection: TakenReadingConnectionModel,
  ): TakenReadingConnectionResponse {
    const response: TakenReadingConnectionResponse = {
      readingId: takenReadingConnection.readingId,
      readingDate: takenReadingConnection.readingDate
        ? new Date(takenReadingConnection.readingDate)
        : new Date(),
      cadastralKey: takenReadingConnection.cadastralKey,
      meterNumber: takenReadingConnection.meterNumber,
      address: takenReadingConnection.address,
      sector: takenReadingConnection.sector,
      account: takenReadingConnection.account,
      clientName: takenReadingConnection.clientName,
      cardId: takenReadingConnection.cardId,
      previousReading: takenReadingConnection.previousReading,
      currentReading: takenReadingConnection.currentReading,
      readingValue: takenReadingConnection.readingValue,
      calculatedConsumption: takenReadingConnection.calculatedConsumption,
      averageConsumption: takenReadingConnection.averageConsumption,
      rateName: takenReadingConnection.rateName,
      readingTypeId: takenReadingConnection.readingTypeId,
      readingTypeName: takenReadingConnection.readingTypeName,
      novelty: takenReadingConnection.novelty,
    };
    return response;
  }

  static fromMonthlySummaryModelToMonthlySummaryResponse(
    monthlySummary: MonthlySummaryModel,
  ): MonthlySummaryResponse {
    const response: MonthlySummaryResponse = {
      month: monthlySummary.month,
      totalReadings: monthlySummary.totalReadings,
      totalConsumption: monthlySummary.totalConsumption,
      averageConsumption: monthlySummary.averageConsumption,
      maxConsumption: monthlySummary.maxConsumption,
      minConsumption: monthlySummary.minConsumption,
      incidentCount: monthlySummary.incidentCount,
      incidentRatePercentage: monthlySummary.incidentRatePercentage,
    };
    return response;
  }

  static fromReadingNoveltyModelToReadingNoveltyResponse(
    readingNovelty: ReadingNoveltyModel,
  ): ReadingNoveltyResponse {
    const response: ReadingNoveltyResponse = {
      readingId: readingNovelty.readingId,
      readingDate: readingNovelty.readingDate,
      readingMonth: readingNovelty.readingMonth,
      readingTime: readingNovelty.readingTime,
      cadastralKey: readingNovelty.cadastralKey,
      meterNumber: readingNovelty.meterNumber,
      address: readingNovelty.address,
      sector: readingNovelty.sector,
      account: readingNovelty.account,
      clientName: readingNovelty.clientName,
      cardId: readingNovelty.cardId,
      previousReading: readingNovelty.previousReading,
      currentReading: readingNovelty.currentReading,
      readingValue: readingNovelty.readingValue,
      calculatedConsumption: readingNovelty.calculatedConsumption,
      averageConsumption: readingNovelty.averageConsumption,
      rateName: readingNovelty.rateName,
      readingTypeId: readingNovelty.readingTypeId,
      readingTypeName: readingNovelty.readingTypeName,
      novelty: readingNovelty.novelty,
      noveltyTypeId: readingNovelty.noveltyTypeId,
      noveltyTypeName: readingNovelty.noveltyTypeName,
      noveltyTypeDescription: readingNovelty.noveltyTypeDescription,
      images: readingNovelty.images,
    };
    return response;
  }
}
