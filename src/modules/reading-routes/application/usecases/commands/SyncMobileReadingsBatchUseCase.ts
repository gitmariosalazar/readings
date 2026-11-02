import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import {
  IRouteAssignmentRepository,
  ROUTE_ASSIGNMENT_REPOSITORY,
  SyncBatchResult,
} from '../../../domain/contracts/route-assignment.repository.interface';
import { SyncMobileReadingsBatchRequest } from '../../dtos/request/route-dtos.request';

@Injectable()
export class SyncMobileReadingsBatchUseCase {
  constructor(
    @Inject(ROUTE_ASSIGNMENT_REPOSITORY)
    private readonly assignmentRepo: IRouteAssignmentRepository,
  ) {}

  async execute(
    dto: SyncMobileReadingsBatchRequest,
    usuarioId: string,
  ): Promise<SyncBatchResult> {
    if (!dto.asignacionId) {
      throw new BadRequestException('ID de asignación requerido.');
    }

    if (!dto.lecturas || dto.lecturas.length === 0) {
      throw new BadRequestException('El lote de lecturas está vacío.');
    }

    return this.assignmentRepo.syncMobileReadingsBatch(
      dto.asignacionId,
      dto.lecturas,
      usuarioId,
    );
  }
}
