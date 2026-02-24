import { CreateObservationReadingRequest } from '../../application/dtos/request/create-observatio-reading.request';
import { ObservationDetailsResponse } from '../../application/dtos/response/observation-dedtails.response';
import { ObservationReadingResponse } from '../../application/dtos/response/observation-reading.response';

export interface InterfaceObservationReadingUseCase {
  createObservationReading(
    observation: CreateObservationReadingRequest,
  ): Promise<ObservationReadingResponse>;
  getObservationsByReadingId(
    readingId: number,
  ): Promise<ObservationReadingResponse[]>;
  getObservationDetailsByCadastralKey(
    cadastralKey: string,
  ): Promise<ObservationDetailsResponse[]>;
  getObservations(): Promise<ObservationDetailsResponse[]>;
}
