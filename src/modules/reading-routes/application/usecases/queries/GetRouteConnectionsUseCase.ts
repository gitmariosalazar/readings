import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import {
  IReadingRouteRepository,
  READING_ROUTE_REPOSITORY,
} from '../../../domain/contracts/reading-route.repository.interface';
import { RouteConnectionResponse } from '../../dtos/response/route-dtos.response';
import { RouteConnectionModel } from '../../../domain/entities/route-connection.entity';
import { ReadingRoutesMapper } from '../../mappers/ReadingRoutesMapper';

@Injectable()
export class GetRouteConnectionsUseCase {
  constructor(
    @Inject(READING_ROUTE_REPOSITORY)
    private readonly routeRepo: IReadingRouteRepository,
  ) {}

  async execute(idRuta: number): Promise<RouteConnectionResponse[]> {
    if (!idRuta) {
      throw new BadRequestException('ID de ruta requerido.');
    }
    const routeConnections: RouteConnectionModel[] =
      await this.routeRepo.getRouteConnections(idRuta);

    if (!routeConnections || routeConnections.length === 0) {
      throw new BadRequestException(
        'No se encontraron conexiones para la ruta especificada.',
      );
    }

    return routeConnections.map((connection) =>
      ReadingRoutesMapper.toRouteConnectionResponse(connection),
    );
  }
}
