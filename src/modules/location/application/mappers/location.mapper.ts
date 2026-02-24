import { CreateLocationRequest } from '../../application/dtos/request/create.location.request';
import { LocationResponse } from '../../application/dtos/response/location.response';
import { LocationModel } from '../../domain/schemas/model/location.model';

export class LocationMapper {
  static fromCreateLocationRequestToLocationModel(
    locationRequest: CreateLocationRequest,
  ): LocationModel {
    return new LocationModel(
      `POINT (${locationRequest.latitude} ${locationRequest.longitude})`,
      locationRequest.metadata!,
      locationRequest.connectionId,
    );
  }

  static fromLocationModelToLocationResponse(
    locationModel: LocationModel,
  ): LocationResponse {
    return {
      locationId: locationModel.getLocationId()!,
      coordinates: locationModel.getCoordinates(),
      metadata: locationModel.getMetadata(),
      connectionId: locationModel.getConnectionId(),
      createdAt: locationModel.getCreatedAt(),
    };
  }
}
