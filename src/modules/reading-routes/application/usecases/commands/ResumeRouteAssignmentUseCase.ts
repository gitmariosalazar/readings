import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import {
  IRouteAssignmentRepository,
  ROUTE_ASSIGNMENT_REPOSITORY,
} from '../../../domain/contracts/route-assignment.repository.interface';

@Injectable()
export class ResumeRouteAssignmentUseCase {
  constructor(
    @Inject(ROUTE_ASSIGNMENT_REPOSITORY)
    private readonly assignmentRepo: IRouteAssignmentRepository,
  ) {}

  async execute(
    idAsignacion: number,
    motivo?: string,
    supervisorId?: string,
  ): Promise<{
    success: boolean;
    idAsignacion: number;
    nuevoEstado: string;
    message: string;
  }> {
    if (!idAsignacion) {
      throw new BadRequestException('ID de asignación inválido.');
    }

    return this.assignmentRepo.resumeAssignment(
      idAsignacion,
      motivo,
      supervisorId,
    );
  }
}
