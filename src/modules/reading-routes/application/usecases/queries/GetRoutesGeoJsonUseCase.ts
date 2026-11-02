import { Injectable, Inject } from '@nestjs/common';
import {
  IReadingRouteRepository,
  READING_ROUTE_REPOSITORY,
} from '../../../domain/contracts/reading-route.repository.interface';

@Injectable()
export class GetRoutesGeoJsonUseCase {
  constructor(
    @Inject(READING_ROUTE_REPOSITORY)
    private readonly routeRepo: IReadingRouteRepository,
  ) {}

  async execute(filter?: { sectorId?: number; activa?: boolean }): Promise<any> {
    return this.routeRepo.getRoutesGeoJson(filter);
  }
}
