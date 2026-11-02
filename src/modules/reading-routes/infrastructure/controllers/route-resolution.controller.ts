import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ResolveRouteForConnectionUseCase } from '../../application/usecases/commands/ResolveRouteForConnectionUseCase';
import { InsertConnectionIntoRouteUseCase } from '../../application/usecases/commands/InsertConnectionIntoRouteUseCase';
import { OptimizeRouteSequenceUseCase } from '../../application/usecases/commands/OptimizeRouteSequenceUseCase';
import {
  InsertConnectionIntoRouteRequest,
  OptimizeRouteSequenceRequest,
  ResolveRouteRequest,
} from '../../application/dtos/request/route-dtos.request';

@Controller()
export class RouteResolutionController {
  constructor(
    private readonly resolveRouteUseCase: ResolveRouteForConnectionUseCase,
    private readonly insertConnectionUseCase: InsertConnectionIntoRouteUseCase,
    private readonly optimizeSequenceUseCase: OptimizeRouteSequenceUseCase,
  ) {}

  @MessagePattern(['reading-routes.resolve-connection', 'routes.resolve-connection'])
  async resolveRoute(@Payload() payload: ResolveRouteRequest) {
    return this.resolveRouteUseCase.execute(payload);
  }

  @MessagePattern(['reading-routes.insert-connection', 'routes.insert-connection'])
  async insertConnection(@Payload() payload: InsertConnectionIntoRouteRequest) {
    return this.insertConnectionUseCase.execute(payload);
  }

  @MessagePattern(['reading-routes.optimize-sequence', 'routes.optimize-sequence'])
  async optimizeSequence(
    @Payload()
    payload: { idRuta: number; acometidaInicio?: string } | OptimizeRouteSequenceRequest,
  ) {
    return this.optimizeSequenceUseCase.execute(payload);
  }
}
