import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import {
  IRouteAssignmentRepository,
  ROUTE_ASSIGNMENT_REPOSITORY,
} from '../../../domain/contracts/route-assignment.repository.interface';
import { LecturistDailyKpiResponse } from '../../dtos/response/route-dtos.response';

@Injectable()
export class GetLecturistDailyKpiUseCase {
  constructor(
    @Inject(ROUTE_ASSIGNMENT_REPOSITORY)
    private readonly assignmentRepo: IRouteAssignmentRepository,
  ) {}

  async execute(
    usuarioId: string,
    fecha?: string,
  ): Promise<LecturistDailyKpiResponse> {
    if (!usuarioId) {
      throw new BadRequestException('ID de usuario lecturista requerido.');
    }

    return this.assignmentRepo.getLecturistDailyKpi(usuarioId, fecha);
  }
}
