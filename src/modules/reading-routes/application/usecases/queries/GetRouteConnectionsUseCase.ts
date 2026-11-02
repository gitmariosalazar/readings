import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import {
  IReadingRouteRepository,
  READING_ROUTE_REPOSITORY,
} from '../../../domain/contracts/reading-route.repository.interface';

@Injectable()
export class GetRouteConnectionsUseCase {
  constructor(
    @Inject(READING_ROUTE_REPOSITORY)
    private readonly routeRepo: IReadingRouteRepository,
  ) {}

  async execute(idRuta: number): Promise<any[]> {
    if (!idRuta) {
      throw new BadRequestException('ID de ruta requerido.');
    }
    return this.routeRepo.getRouteConnections(idRuta);
  }
}
