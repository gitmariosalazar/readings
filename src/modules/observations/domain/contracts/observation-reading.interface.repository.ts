import { ObservationReadingModel } from '../schemas/model/observation-reading.model';
import { ObservationDetailsModel } from '../schemas/model/observation-details.model';

export interface InterfaceObservationReadingRepository {
  createObservationReading(
    observation: ObservationReadingModel,
  ): Promise<ObservationReadingModel>;
  getObservationsByReadingId(
    readingId: number,
  ): Promise<ObservationReadingModel[]>;
  getObservationDetailsByCadastralKey(
    cadastralKey: string,
  ): Promise<ObservationDetailsModel[]>;
  getObservations(): Promise<ObservationDetailsModel[]>;
}
