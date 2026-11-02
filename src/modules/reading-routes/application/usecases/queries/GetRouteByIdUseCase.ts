import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  IReadingRouteRepository,
  READING_ROUTE_REPOSITORY,
} from '../../../domain/contracts/reading-route.repository.interface';
import { ReadingRouteEntity } from '../../../domain/entities/reading-route.entity';

@Injectable()
export class GetRouteByIdUseCase {
  constructor(
    @Inject(READING_ROUTE_REPOSITORY)
    private readonly routeRepo: IReadingRouteRepository,
  ) {}

  async execute(id: number): Promise<ReadingRouteEntity> {
    const route = await this.routeRepo.findById(id);
    if (!route) {
      throw new NotFoundException(`Ruta con ID ${id} no encontrada.`);
    }
    return route;
  }
}
