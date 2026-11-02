import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import {
  IReadingRouteRepository,
  READING_ROUTE_REPOSITORY,
} from '../../../domain/contracts/reading-route.repository.interface';
import { OptimizeRouteSequenceRequest } from '../../dtos/request/route-dtos.request';
import { OptimizeRouteSequenceResponse } from '../../dtos/response/route-dtos.response';

@Injectable()
export class OptimizeRouteSequenceUseCase {
  constructor(
    @Inject(READING_ROUTE_REPOSITORY)
    private readonly routeRepo: IReadingRouteRepository,
  ) {}

  async execute(
    dto: OptimizeRouteSequenceRequest,
  ): Promise<OptimizeRouteSequenceResponse> {
    if (!dto.idRuta) {
      throw new BadRequestException('ID de ruta requerido.');
    }

    const result = await this.routeRepo.optimizeRouteSequence(
      dto.idRuta,
      dto.acometidaInicio,
    );

    return {
      success: true,
      idRuta: dto.idRuta,
      totalReordenadas: result.totalReordenadas,
      distanciaTotalCaminadaMetros: result.distanciaTotalCaminadaMetros,
      message: `Ruta ${dto.idRuta} reordenada exitosamente (${result.totalReordenadas} acometidas secuenciadas, distancia estimada ${result.distanciaTotalCaminadaMetros}m).`,
    };
  }
}
