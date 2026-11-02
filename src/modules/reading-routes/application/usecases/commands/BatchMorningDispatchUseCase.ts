import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import {
  IRouteAssignmentRepository,
  ROUTE_ASSIGNMENT_REPOSITORY,
} from '../../../domain/contracts/route-assignment.repository.interface';
import { BatchMorningDispatchRequest } from '../../dtos/request/route-dtos.request';
import { BatchDispatchResponse } from '../../dtos/response/route-dtos.response';

@Injectable()
export class BatchMorningDispatchUseCase {
  constructor(
    @Inject(ROUTE_ASSIGNMENT_REPOSITORY)
    private readonly assignmentRepo: IRouteAssignmentRepository,
  ) {}

  async execute(
    dto: BatchMorningDispatchRequest,
    despachadorId: string,
  ): Promise<BatchDispatchResponse> {
    if (!dto.lecturistaIds || dto.lecturistaIds.length === 0) {
      throw new BadRequestException(
        'Debe proporcionar al menos un lecturista para el despacho matutino.',
      );
    }

    if (!dto.periodo || !/^\d{4}-(0[1-9]|1[0-2])$/.test(dto.periodo)) {
      throw new BadRequestException(
        'El periodo debe tener el formato YYYY-MM (ej. 2026-11).',
      );
    }

    const fecha = dto.fechaProgramada
      ? new Date(dto.fechaProgramada)
      : new Date();

    const sectorId = dto.sectorId ?? dto.zonaId ?? null;

    return this.assignmentRepo.executeMorningBatchDispatch(
      sectorId,
      dto.periodo,
      fecha,
      dto.lecturistaIds,
      despachadorId,
    );
  }
}
