import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { UUID } from 'crypto';
import { ResolveIncidentRequest } from '../../dtos/request/resolve-incident.request';
import { IncidentResponse } from '../../dtos/response/incident.response';
import { InterfaceIncidentRepository } from '../../../domain/contracts/incident.interface.repository';
import { IncidentMapper } from '../../mappers/incident.mapper';
import { validateFields } from '../../../../../shared/validators/fields.validators';
import { statusCode } from '../../../../../settings/environments/status-code';

@Injectable()
export class ResolveIncidentUseCase {
  constructor(
    @Inject('IncidentRepository')
    private readonly incidentRepository: InterfaceIncidentRepository,
  ) {}

  async execute(
    incidentId: string,
    request: ResolveIncidentRequest,
    resolverUserId: UUID,
  ): Promise<IncidentResponse | null> {
    try {
      const camposRequeridos = ['description', 'repairCost', 'chargeToUser'];
      const errores = validateFields(request, camposRequeridos);

      if (errores.length > 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: errores,
        });
      }

      if (request.repairCost < 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'El costo de reparación no puede ser negativo.',
        });
      }

      // Verificar si el incidente existe antes de proceder
      const existingIncident =
        await this.incidentRepository.findById(incidentId);
      if (!existingIncident) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `El incidente con ID ${incidentId} no fue encontrado.`,
        });
      }

      if (existingIncident.status === 'RESUELTO') {
        throw new RpcException({
          statusCode: statusCode.CONFLICT,
          message: `El incidente con ID ${incidentId} ya ha sido resuelto previamente.`,
        });
      }

      const resolvedModel = await this.incidentRepository.resolveIncident(
        incidentId,
        resolverUserId,
        request.description,
        request.repairCost,
        request.chargeToUser,
        request.images ?? [],
      );

      if (!resolvedModel) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'No se pudo resolver el incidente en la base de datos.',
        });
      }

      return IncidentMapper.fromModelToResponse(resolvedModel);
    } catch (error) {
      throw error;
    }
  }
}
