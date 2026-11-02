import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FindReadingRoutesUseCase } from '../../application/usecases/queries/FindReadingRoutesUseCase';
import { GetRouteByIdUseCase } from '../../application/usecases/queries/GetRouteByIdUseCase';
import { GetRoutesGeoJsonUseCase } from '../../application/usecases/queries/GetRoutesGeoJsonUseCase';
import { GetRouteCentroidsGeoJsonUseCase } from '../../application/usecases/queries/GetRouteCentroidsGeoJsonUseCase';
import { GetRouteConnectionsUseCase } from '../../application/usecases/queries/GetRouteConnectionsUseCase';
import { FindReadingRoutesQueryRequest } from '../../application/dtos/request/route-dtos.request';

@Controller()
export class ReadingRouteCatalogController {
  constructor(
    private readonly findRoutesUseCase: FindReadingRoutesUseCase,
    private readonly getRouteByIdUseCase: GetRouteByIdUseCase,
    private readonly getRoutesGeoJsonUseCase: GetRoutesGeoJsonUseCase,
    private readonly getCentroidsGeoJsonUseCase: GetRouteCentroidsGeoJsonUseCase,
    private readonly getRouteConnectionsUseCase: GetRouteConnectionsUseCase,
  ) {}

  @MessagePattern(['reading-routes.find-all', 'routes.find-all'])
  async findAll(@Payload() payload: FindReadingRoutesQueryRequest) {
    return this.findRoutesUseCase.execute(payload);
  }

  @MessagePattern(['reading-routes.get-geojson', 'routes.get-geojson'])
  async getGeoJson(@Payload() payload: { sectorId?: number; activa?: boolean }) {
    return this.getRoutesGeoJsonUseCase.execute(payload);
  }

  @MessagePattern(['reading-routes.get-centroids', 'routes.get-centroids'])
  async getCentroids(@Payload() payload: { activaOnly?: boolean }) {
    return this.getCentroidsGeoJsonUseCase.execute(payload?.activaOnly);
  }

  @MessagePattern(['reading-routes.get-by-id', 'routes.get-by-id'])
  async getById(@Payload() payload: { id: number } | number) {
    const id = typeof payload === 'number' ? payload : payload?.id;
    return this.getRouteByIdUseCase.execute(Number(id));
  }

  @MessagePattern(['reading-routes.get-connections', 'routes.get-connections'])
  async getConnections(@Payload() payload: { id: number } | number) {
    const id = typeof payload === 'number' ? payload : payload?.id;
    return this.getRouteConnectionsUseCase.execute(Number(id));
  }
}
