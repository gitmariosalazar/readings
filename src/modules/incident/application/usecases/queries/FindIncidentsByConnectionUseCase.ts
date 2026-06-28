import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { IncidentResponse } from '../../dtos/response/incident.response';
import { InterfaceIncidentRepository } from '../../../domain/contracts/incident.interface.repository';
import { IncidentMapper } from '../../mappers/incident.mapper';
import { statusCode } from '../../../../../settings/environments/status-code';
import { IncidentDetailRowResponse } from '../../../domain/schemas/response/view_incident.response';

@Injectable()
/**
 * Use case to find all incidents associated with a specific connection ID.
 */
export class FindIncidentsByConnectionUseCase {
  constructor(
    @Inject('IncidentRepository')
    private readonly incidentRepository: InterfaceIncidentRepository,
  ) {}

  async execute(connectionId: string): Promise<IncidentDetailRowResponse[]> {
    try {
      if (!connectionId || connectionId.trim().length === 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'El ID de la acometiva es requerido para buscar incidentes.',
        });
      }

      const models =
        await this.incidentRepository.findIncidentsByConnection(connectionId);
      return models;
    } catch (error) {
      throw error;
    }
  }
}
