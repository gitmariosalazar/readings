import {
  ReadingBasicInfoResponse,
  ReadingInfoResponse,
} from '../dtos/response/reading-basic.response';
import { ReadingBasicInfoModel } from '../../domain/schemas/model/reading-basic-info.model';
import { ReadingInfoModel } from '../../domain/schemas/model/reading-info.model';

export class ReadingInfoMapper {
  static toBasicInfoResponse(
    domainModel: ReadingBasicInfoModel,
  ): ReadingBasicInfoResponse {
    return {
      readingId: domainModel.readingId,
      previousReadingDate: domainModel.previousReadingDate,
      cadastralKey: domainModel.cadastralKey,
      cardId: domainModel.cardId,
      clientName: domainModel.clientName,
      address: domainModel.address,
      previousReading: domainModel.previousReading,
      currentReading: domainModel.currentReading,
      sector: domainModel.sector,
      account: domainModel.account,
      readingValue: domainModel.readingValue,
      averageConsumption: domainModel.averageConsumption,
      meterNumber: domainModel.meterNumber,
      rateId: domainModel.rateId,
      rateName: domainModel.rateName,
    };
  }

  static toBasicInfoResponseList(
    domainModels: ReadingBasicInfoModel[],
  ): ReadingBasicInfoResponse[] {
    return domainModels.map((model) => this.toBasicInfoResponse(model));
  }

  static toInfoResponse(domainModel: ReadingInfoModel): ReadingInfoResponse {
    return {
      readingId: domainModel.readingId,
      previousReadingDate: domainModel.previousReadingDate,
      readingTime: domainModel.readingTime,
      cadastralKey: domainModel.cadastralKey,
      cardId: domainModel.cardId,
      clientName: domainModel.clientName,
      clientPhones: domainModel.clientPhones.map((p) => ({
        telefonoid: p.telefonoid,
        numero: p.numero,
      })),
      clientEmails: domainModel.clientEmails.map((e) => ({
        emailid: e.emailid,
        email: e.email,
      })),
      address: domainModel.address,
      previousReading: domainModel.previousReading,
      currentReading: domainModel.currentReading,
      sector: domainModel.sector,
      account: domainModel.account,
      readingValue: domainModel.readingValue,
      averageConsumption: domainModel.averageConsumption,
      meterNumber: domainModel.meterNumber,
      rateId: domainModel.rateId,
      rateName: domainModel.rateName,
      hasCurrentReading: domainModel.hasCurrentReading,
      monthReading: domainModel.monthReading,
      startDatePeriod: domainModel.startDatePeriod,
      endDatePeriod: domainModel.endDatePeriod,
    };
  }

  static toInfoResponseList(
    domainModels: ReadingInfoModel[],
  ): ReadingInfoResponse[] {
    return domainModels.map((model) => this.toInfoResponse(model));
  }
}
