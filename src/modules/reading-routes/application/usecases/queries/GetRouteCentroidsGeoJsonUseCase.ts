import { Injectable, Inject } from '@nestjs/common';
import {
  IReadingRouteRepository,
  READING_ROUTE_REPOSITORY,
} from '../../../domain/contracts/reading-route.repository.interface';

@Injectable()
export class GetRouteCentroidsGeoJsonUseCase {
  constructor(
    @Inject(READING_ROUTE_REPOSITORY)
    private readonly routeRepo: IReadingRouteRepository,
  ) {}

  async execute(activaOnly?: boolean): Promise<any> {
    return this.routeRepo.getCentroidsGeoJson(activaOnly ?? true);
  }
}
