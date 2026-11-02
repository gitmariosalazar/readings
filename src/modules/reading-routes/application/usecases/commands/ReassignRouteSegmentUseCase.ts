import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import {
  IRouteAssignmentRepository,
  ROUTE_ASSIGNMENT_REPOSITORY,
} from '../../../domain/contracts/route-assignment.repository.interface';
import { ReassignRouteSegmentRequest } from '../../dtos/request/route-dtos.request';
import { ReassignRouteSegmentResponse } from '../../dtos/response/route-dtos.response';

@Injectable()
export class ReassignRouteSegmentUseCase {
  constructor(
    @Inject(ROUTE_ASSIGNMENT_REPOSITORY)
    private readonly assignmentRepo: IRouteAssignmentRepository,
  ) {}

  async execute(
    dto: ReassignRouteSegmentRequest,
    supervisorId: string,
  ): Promise<ReassignRouteSegmentResponse> {
    if (!dto.asignacionId || !dto.nuevoUsuarioId) {
      throw new BadRequestException('Debe especificar la asignación origen y el nuevo lecturista.');
    }

    if (!dto.motivo || dto.motivo.trim().length < 5) {
      throw new BadRequestException('El motivo de la reasignación debe tener al menos 5 caracteres.');
    }

    return this.assignmentRepo.reassignRouteSegment(
      dto.asignacionId,
      dto.nuevoUsuarioId,
      dto.motivo,
      supervisorId,
    );
  }
}
