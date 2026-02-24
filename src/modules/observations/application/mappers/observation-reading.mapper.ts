import { CreateObservationReadingRequest } from '../../application/dtos/request/create-observatio-reading.request';
import { ObservationReadingResponse } from '../../application/dtos/response/observation-reading.response';
import { ObservationDetailsResponse } from '../../application/dtos/response/observation-dedtails.response';
import { ObservationReadingModel } from '../../domain/schemas/model/observation-reading.model';
import { ObservationModel } from '../../domain/schemas/model/observation.model';
import { ObservationDetailsModel } from '../../domain/schemas/model/observation-details.model';

export class ObservationReadingMapper {
  static fromCreateObservationReadingToModel(
    request: CreateObservationReadingRequest,
  ): ObservationReadingModel {
    const observationIdModel = new ObservationModel(
      0,
      request.observationTitle,
      request.observationDetails,
    );
    return new ObservationReadingModel(
      0,
      request.readingId,
      observationIdModel,
    );
  }

  static fromObservationReadingModelToResponse(
    model: ObservationReadingModel,
  ): ObservationReadingResponse {
    return {
      observationReadingId: model.getObservationReadingId() ?? 0,
      readingId: model.getReadingId(),
      observationId: model.getObservation()?.getObservationId() ?? 0,
      observationTitle: model.getObservation()?.getObservationTitle() ?? '',
      observationDetails: model.getObservation()?.getObservationDetails() ?? '',
    };
  }

  static fromObservationDetailsModelToResponse(
    model: ObservationDetailsModel,
  ): ObservationDetailsResponse {
    return {
      observationId: model.observationId,
      observationTitle: model.observationTitle,
      observationDetails: model.observationDetails,
      observationDate: model.observationDate,
      readingId: model.readingId,
      connectionId: model.connectionId,
      previousReading: model.previousReading,
      currentReading: model.currentReading,
      sector: model.sector,
      account: model.account,
      cadastralKey: model.cadastralKey,
      rentalIncomeCode: model.rentalIncomeCode,
      readingValue: model.readingValue,
      noveltyReadingTypeId: model.noveltyReadingTypeId,
      noveltyTypeName: model.noveltyTypeName,
      noveltyTypeDescription: model.noveltyTypeDescription,
      clientId: model.clientId,
      address: model.address,
      clientName: model.clientName,
      observations: model.observations,
    };
  }
}
