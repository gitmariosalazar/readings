import { Inject, Injectable } from '@nestjs/common';
import { InterfaceReadingAnalyticsRepository } from '../../domain/contracts/reading-analytics.interface.repository';
import { SectorPerformanceFilterRequest } from '../dtos/request/sector-performance-filter.request';
import { SectorPerformanceResponse } from '../dtos/response/sector-performance.response';
import { ReadingAnalyticsMapper } from '../mappers/reading-analytics.mapper';

@Injectable()
export class GetSectorPerformanceAnalyticsUseCase {
  constructor(
    @Inject('ReadingAnalyticsRepository')
    private readonly analyticsRepository: InterfaceReadingAnalyticsRepository,
  ) {}

  async execute(
    request: SectorPerformanceFilterRequest,
  ): Promise<SectorPerformanceResponse[]> {
    const models = await this.analyticsRepository.getSectorPerformance({
      month: request.month,
      sector: request.sector,
      sortBy: request.sortBy,
    });
    return ReadingAnalyticsMapper.toSectorPerformanceResponseList(models);
  }
}
