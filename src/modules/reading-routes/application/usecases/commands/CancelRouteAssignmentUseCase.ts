import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import {
  IRouteAssignmentRepository,
  ROUTE_ASSIGNMENT_REPOSITORY,
} from '../../../domain/contracts/route-assignment.repository.interface';

@Injectable()
export class CancelRouteAssignmentUseCase {
  constructor(
    @Inject(ROUTE_ASSIGNMENT_REPOSITORY)
    private readonly assignmentRepo: IRouteAssignmentRepository,
  ) {}

  async execute(
    idAsignacion: number,
    motivo?: string,
    supervisorId?: string,
  ): Promise<{ success: boolean; message: string }> {
    if (!idAsignacion) {
      throw new BadRequestException('ID de asignación inválido.');
    }

    const success = await this.assignmentRepo.cancelAssignment(
      idAsignacion,
      motivo,
      supervisorId,
    );

    return {
      success,
      message: success
        ? `Asignación ${idAsignacion} cancelada correctamente.`
        : `No se pudo cancelar la asignación ${idAsignacion} (verifique si ya fue completada o cancelada).`,
    };
  }
}
