import { LocationModel } from '../../../../domain/schemas/model/location.model';
import { LocationSqlResult } from '../../../interfaces/sql/location.sql.result';

export class LocationAdapter {
  static fromLocationSqlResultToLocationModel(
    locationSqlResult: LocationSqlResult,
  ): LocationModel {
    return new LocationModel(
      locationSqlResult.coordinates,
      typeof locationSqlResult.metadata === 'string'
        ? JSON.parse(locationSqlResult.metadata)
        : locationSqlResult.metadata,
      locationSqlResult.connectionId,
      locationSqlResult.locationId,
      locationSqlResult.createdAt,
    );
  }
}
