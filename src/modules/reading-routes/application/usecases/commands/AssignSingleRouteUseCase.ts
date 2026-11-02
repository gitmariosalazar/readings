import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import {
  IRouteAssignmentRepository,
  ROUTE_ASSIGNMENT_REPOSITORY,
} from '../../../domain/contracts/route-assignment.repository.interface';
import { AssignSingleRouteRequest } from '../../dtos/request/route-dtos.request';

@Injectable()
export class AssignSingleRouteUseCase {
  constructor(
    @Inject(ROUTE_ASSIGNMENT_REPOSITORY)
    private readonly assignmentRepo: IRouteAssignmentRepository,
  ) {}

  async execute(
    dto: AssignSingleRouteRequest,
    despachadorId: string,
  ): Promise<{ idAsignacion: number; message: string }> {
    if (!dto.rutaId || !dto.usuarioId || !dto.periodo) {
      throw new BadRequestException('Faltan campos obligatorios para la asignación.');
    }

    const fecha = dto.fechaProgramada
      ? new Date(dto.fechaProgramada)
      : new Date();

    const idAsignacion = await this.assignmentRepo.assignSingleRoute(
      dto.rutaId,
      dto.usuarioId,
      dto.periodo,
      fecha,
      despachadorId,
    );

    return {
      idAsignacion,
      message: `Ruta ${dto.rutaId} asignada exitosamente con ID ${idAsignacion}.`,
    };
  }
}
