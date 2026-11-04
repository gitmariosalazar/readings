import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import {
  IRouteAssignmentRepository,
  ROUTE_ASSIGNMENT_REPOSITORY,
} from '../../../domain/contracts/route-assignment.repository.interface';
import { RouteAssignmentEntity } from '../../../domain/entities/route-assignment.entity';
import { GetLecturistAssignedRoutesRequest } from '../../dtos/request/route-dtos.request';

@Injectable()
export class GetLecturistAssignedRoutesUseCase {
  constructor(
    @Inject(ROUTE_ASSIGNMENT_REPOSITORY)
    private readonly assignmentRepo: IRouteAssignmentRepository,
  ) {}

  async execute(
    request: GetLecturistAssignedRoutesRequest,
  ): Promise<RouteAssignmentEntity[]> {
    if (!request?.usuarioId || typeof request.usuarioId !== 'string') {
      throw new BadRequestException('ID de usuario lecturista requerido.');
    }

    return this.assignmentRepo.getAssignedRoutesByLecturist(
      request.usuarioId,
      request.fecha,
      request.periodoMes,
    );
  }
}
