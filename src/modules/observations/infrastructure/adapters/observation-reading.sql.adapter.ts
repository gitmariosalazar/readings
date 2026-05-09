import { ObservationReadingModel } from '../../domain/schemas/model/observation-reading.model';
import { ObservationModel } from '../../domain/schemas/model/observation.model';
import { ObservationDetailsModel } from '../../domain/schemas/model/observation-details.model';
import { ObservationReadingSQLResponse } from '../interfaces/sql/observatio-reading.sql.response';

export class ObservationReadingSQLAdapter {
  static toObservationReadingModel(
    sqlResponse: ObservationReadingSQLResponse,
  ): ObservationReadingModel {
    return new ObservationReadingModel(
      sqlResponse.observation_reading_id,
      sqlResponse.reading_id,
      new ObservationModel(
        sqlResponse.observation_id,
        sqlResponse.observation_title,
        sqlResponse.observation_details,
      ),
    );
  }

  static toObservationDetailsModel(sqlResponse: any): ObservationDetailsModel {
    return new ObservationDetailsModel(
      sqlResponse.observation_reading_id || 0,
      sqlResponse.observation_title,
      sqlResponse.observation_detail,
      sqlResponse.registration_date,
      sqlResponse.reading_id,
      sqlResponse.connection_id,
      sqlResponse.previous_reading,
      sqlResponse.current_reading,
      sqlResponse.sector,
      sqlResponse.account,
      sqlResponse.cadastral_key || '',
      sqlResponse.rental_income_code || 0,
      sqlResponse.reading_value,
      sqlResponse.novelty_reading_type_id,
      sqlResponse.novelty_type_name,
      sqlResponse.novelty_type_description,
      sqlResponse.client_id,
      sqlResponse.address,
      sqlResponse.client_name,
      sqlResponse.observations || '',
    );
  }
}
