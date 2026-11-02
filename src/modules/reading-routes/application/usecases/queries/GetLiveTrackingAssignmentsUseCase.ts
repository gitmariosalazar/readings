import { Injectable, Inject } from '@nestjs/common';
import {
  IRouteAssignmentRepository,
  ROUTE_ASSIGNMENT_REPOSITORY,
} from '../../../domain/contracts/route-assignment.repository.interface';
import { RouteAssignmentEntity } from '../../../domain/entities/route-assignment.entity';

@Injectable()
export class GetLiveTrackingAssignmentsUseCase {
  constructor(
    @Inject(ROUTE_ASSIGNMENT_REPOSITORY)
    private readonly assignmentRepo: IRouteAssignmentRepository,
  ) {}

  async execute(
    periodoMes?: string,
    fecha?: string,
  ): Promise<RouteAssignmentEntity[]> {
    return this.assignmentRepo.getLiveTracking(periodoMes, fecha);
  }
}
