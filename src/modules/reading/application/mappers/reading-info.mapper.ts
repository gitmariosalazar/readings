import {
  ReadingBasicInfoResponse,
  ReadingDetailedResponse,
  ReadingInfoResponse,
} from '../dtos/response/reading-basic.response';
import { ReadingBasicInfoModel } from '../../domain/schemas/model/reading-basic-info.model';
import {
  ReadingDetailedModel,
  ReadingInfoModel,
} from '../../domain/schemas/model/reading-info.model';

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
      readingDate: domainModel.readingDate,
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
      connectionStateId: domainModel.connectionStateId,
      connectionStateName: domainModel.connectionStateName,
      connectionStateDescription: domainModel.connectionStateDescription,
      permitReading: domainModel.permitReading,
      connectionLocation: domainModel.connectionLocation,
      images: domainModel.images?.map((img) => ({
        id: img.id,
        path: img.path,
        novelty: img.novelty,
      })),
      observations: domainModel.observations?.map((obs) => ({
        id: obs.id,
        title: obs.title,
        observation: obs.observation,
      })),
      readingLocation: domainModel.readingLocation,
    };
  }

  static toReadingDetailedResponse(
    domainModel: ReadingDetailedModel,
  ): ReadingDetailedResponse {
    return {
      readingId: domainModel.readingId,
      readingTime: domainModel.readingTime,
      readingDate: domainModel.readingDate,
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
      readingMonth: domainModel.readingMonth,
      readingMonthName: domainModel.readingMonthName,
      novelty: domainModel.novelty,
      consumption: domainModel.consumption,
      startDatePeriod: domainModel.startDatePeriod,
      endDatePeriod: domainModel.endDatePeriod,
      connectionStateId: domainModel.connectionStateId,
      connectionStateName: domainModel.connectionStateName,
      connectionStateDescription: domainModel.connectionStateDescription,
      permitReading: domainModel.permitReading,
      connectionLocation: domainModel.connectionLocation,
      images: domainModel.images?.map((img) => ({
        id: img.id,
        path: img.path,
        novelty: img.novelty,
      })),
      observations: domainModel.observations?.map((obs) => ({
        id: obs.id,
        title: obs.title,
        observation: obs.observation,
      })),
      readingLocation: domainModel.readingLocation,
    };
  }

  static toInfoResponseList(
    domainModels: ReadingInfoModel[],
  ): ReadingInfoResponse[] {
    return domainModels.map((model) => this.toInfoResponse(model));
  }
}
