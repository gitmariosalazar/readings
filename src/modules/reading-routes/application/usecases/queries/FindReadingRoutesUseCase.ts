import { Injectable, Inject } from '@nestjs/common';
import {
  IReadingRouteRepository,
  READING_ROUTE_REPOSITORY,
} from '../../../domain/contracts/reading-route.repository.interface';
import { FindReadingRoutesQueryRequest } from '../../dtos/request/route-dtos.request';
import { ReadingRouteEntity } from '../../../domain/entities/reading-route.entity';

@Injectable()
export class FindReadingRoutesUseCase {
  constructor(
    @Inject(READING_ROUTE_REPOSITORY)
    private readonly routeRepo: IReadingRouteRepository,
  ) {}

  async execute(
    query?: FindReadingRoutesQueryRequest,
  ): Promise<{ items: ReadingRouteEntity[]; total: number; page: number; limit: number }> {
    const page = query?.page ? Math.max(1, Number(query.page)) : 1;
    const limit = query?.limit ? Math.max(1, Number(query.limit)) : 100;
    const offset = (page - 1) * limit;

    const { items, total } = await this.routeRepo.findAll({
      sectorId: query?.sectorId,
      activa: query?.activa,
      search: query?.search,
      limit,
      offset,
    });

    return { items, total, page, limit };
  }
}
