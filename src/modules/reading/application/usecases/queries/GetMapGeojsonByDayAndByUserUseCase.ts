import { Inject, Injectable } from '@nestjs/common';
import { MapRouteFeatureCollection } from '../../../domain/schemas/response/map-geojson';
import { InterfaceReadingRepository } from '../../../domain/contracts/reading.interface.repository';
import { statusCode } from '../../../../../settings/environments/status-code';
import { RpcException } from '@nestjs/microservices/exceptions/rpc-exception';

@Injectable()
export class GetMapGeojsonByDayAndByUserUseCase {
  constructor(
    @Inject('ReadingRepository')
    private readonly readingRepository: InterfaceReadingRepository,
  ) {}

  async execute(
    date: string,
    userId?: string,
  ): Promise<MapRouteFeatureCollection> {
    try {
      if (!date) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: `Month is required`,
        });
      }
      const geojsonData =
        await this.readingRepository.getMapGeojsonByDayAndByUser(date, userId);
      return geojsonData;
    } catch (error) {
      throw error;
    }
  }
}
