import { ObservationReadingResponse } from "src/modules/observations/domain/schemas/dto/response/observation-reading.response";
import { ObservationReadingSQLResponse } from "../../../interfaces/observatio-reading.sql.response";

export class ObservationReadingSQLAdapter {
  static toObservationReadingResponse(sqlResponse: ObservationReadingSQLResponse): ObservationReadingResponse {
    return {
      observationReadingId: sqlResponse.observationReadingId,
      readingId: sqlResponse.readingId,
      observationId: sqlResponse.observationId,
      observationTitle: sqlResponse.observationTitle,
      observationDetails: sqlResponse.observationDetails,
    };
  }
}