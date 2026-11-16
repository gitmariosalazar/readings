import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  IRouteAssignmentRepository,
  ROUTE_ASSIGNMENT_REPOSITORY,
} from '../../../domain/contracts/route-assignment.repository.interface';
import { AsignacionRutaDetalle } from '../../dtos/response/route-dtos.response';
import { AsignacionRutaDetalleEntity } from '../../../domain/entities/reading-route.entity';
import { ReadingRoutesMapper } from '../../mappers/ReadingRoutesMapper';

@Injectable()
export class GetMobileWorkPackUseCase {
  constructor(
    @Inject(ROUTE_ASSIGNMENT_REPOSITORY)
    private readonly assignmentRepo: IRouteAssignmentRepository,
  ) {}

  async execute(idAsignacion: number): Promise<AsignacionRutaDetalle> {
    if (!idAsignacion) {
      throw new BadRequestException('ID de asignación inválido.');
    }

    const pack: AsignacionRutaDetalleEntity =
      await this.assignmentRepo.getMobileWorkPack(idAsignacion);
    if (!pack) {
      throw new NotFoundException(`Asignación ${idAsignacion} no encontrada.`);
    }

    const response: AsignacionRutaDetalle =
      ReadingRoutesMapper.toAsignacionRutaDetalleResponse(pack);

    return response;
  }
}
