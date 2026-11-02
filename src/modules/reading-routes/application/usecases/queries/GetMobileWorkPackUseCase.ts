import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import {
  IRouteAssignmentRepository,
  ROUTE_ASSIGNMENT_REPOSITORY,
} from '../../../domain/contracts/route-assignment.repository.interface';

@Injectable()
export class GetMobileWorkPackUseCase {
  constructor(
    @Inject(ROUTE_ASSIGNMENT_REPOSITORY)
    private readonly assignmentRepo: IRouteAssignmentRepository,
  ) {}

  async execute(idAsignacion: number): Promise<any> {
    if (!idAsignacion) {
      throw new BadRequestException('ID de asignación inválido.');
    }

    const pack = await this.assignmentRepo.getMobileWorkPack(idAsignacion);
    if (!pack) {
      throw new NotFoundException(`Asignación ${idAsignacion} no encontrada.`);
    }

    return pack;
  }
}
