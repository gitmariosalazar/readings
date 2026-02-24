import { LocationModel } from '../schemas/model/location.model';

export interface InterfaceLocationRepository {
  createLocation(location: LocationModel): Promise<LocationModel | null>;
  getLocationById(locationId: number): Promise<LocationModel | null>;
  getLocationsByConnectionId(connectionId: string): Promise<LocationModel[]>;
  verifyLocationByConnectionIdExists(connectionId: string): Promise<boolean>;
}
