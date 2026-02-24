import { CreateLocationRequest } from '../../application/dtos/request/create.location.request';
import { LocationResponse } from '../../application/dtos/response/location.response';

export interface InterfaceLocationUseCase {
  createLocation(
    location: CreateLocationRequest,
  ): Promise<LocationResponse | null>;
  getLocationById(locationId: number): Promise<LocationResponse | null>;
  getLocationsByConnectionId(connectionId: string): Promise<LocationResponse[]>;
  verifyLocationByConnectionIdExists(connectionId: string): Promise<boolean>;
}
