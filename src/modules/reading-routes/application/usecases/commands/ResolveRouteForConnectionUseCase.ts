import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import {
  IReadingRouteRepository,
  READING_ROUTE_REPOSITORY,
} from '../../../domain/contracts/reading-route.repository.interface';
import { ResolveRouteRequest } from '../../dtos/request/route-dtos.request';
import { ResolvedRouteResponse } from '../../dtos/response/route-dtos.response';

@Injectable()
export class ResolveRouteForConnectionUseCase {
  constructor(
    @Inject(READING_ROUTE_REPOSITORY)
    private readonly routeRepo: IReadingRouteRepository,
  ) {}

  async execute(dto: ResolveRouteRequest): Promise<ResolvedRouteResponse> {
    if (dto.latitud === undefined || dto.longitud === undefined) {
      throw new BadRequestException('Se requieren latitud y longitud válidas.');
    }

    const resolved = await this.routeRepo.resolveRouteByCoordinates(
      dto.longitud,
      dto.latitud,
      dto.sector,
    );

    if (!resolved) {
      throw new NotFoundException(
        `No fue posible determinar una ruta para las coordenadas [${dto.latitud}, ${dto.longitud}].`,
      );
    }

    const nextSequence = await this.routeRepo.getNextSequenceNumber(resolved.idRuta);

    return {
      idRuta: resolved.idRuta,
      codigoRuta: resolved.codigo,
      nombreRuta: resolved.nombre,
      sectorId: resolved.sectorId,
      metodoResolucion: resolved.metodoResolucion,
      distanciaMetros: resolved.distanciaMetros,
      ordenSugerido: nextSequence,
    };
  }
}
