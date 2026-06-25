import { Inject, Injectable } from '@nestjs/common';
import { IncidentResponse } from '../../dtos/response/incident.response';
import { InterfaceIncidentRepository } from '../../../domain/contracts/incident.interface.repository';
import { IncidentMapper } from '../../mappers/incident.mapper';

@Injectable()
/**
 * Use case to search and list incidents using dynamic filters (connectionId, status, priority, type).
 */
export class SearchIncidentsUseCase {
  constructor(
    @Inject('IncidentRepository')
    private readonly incidentRepository: InterfaceIncidentRepository,
  ) {}

  async execute(filters: {
    connectionId?: string | null;
    status?: string | null;
    priority?: string | null;
    incidentTypeId?: number | null;
  }): Promise<IncidentResponse[]> {
    try {
      const models = await this.incidentRepository.findIncidents(filters);
      return models.map((model) => IncidentMapper.fromModelToResponse(model));
    } catch (error) {
      throw error;
    }
  }
}
