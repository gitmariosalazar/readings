import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import {
  IReadingRouteRepository,
  READING_ROUTE_REPOSITORY,
} from '../../../domain/contracts/reading-route.repository.interface';
import { InsertConnectionIntoRouteRequest } from '../../dtos/request/route-dtos.request';

@Injectable()
export class InsertConnectionIntoRouteUseCase {
  constructor(
    @Inject(READING_ROUTE_REPOSITORY)
    private readonly routeRepo: IReadingRouteRepository,
  ) {}

  async execute(
    dto: InsertConnectionIntoRouteRequest,
  ): Promise<{ success: boolean; message: string }> {
    if (!dto.idRuta || !dto.acometidaId) {
      throw new BadRequestException('Se requieren idRuta y acometidaId.');
    }

    await this.routeRepo.insertConnection({
      idRuta: dto.idRuta,
      acometidaId: dto.acometidaId,
      ordenSugerido: dto.ordenSugerido,
      ladoCalle: dto.ladoCalle,
      instruccionAcceso: dto.instruccionAcceso,
    });

    return {
      success: true,
      message: `Acometida ${dto.acometidaId} insertada exitosamente en la ruta ${dto.idRuta}.`,
    };
  }
}
