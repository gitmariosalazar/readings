import { Inject, Injectable } from '@nestjs/common';
import { IncidentResponse } from '../../dtos/response/incident.response';
import { InterfaceIncidentRepository } from '../../../domain/contracts/incident.interface.repository';
import { IncidentMapper } from '../../mappers/incident.mapper';
import { IncidentDetailRowResponse } from '../../../domain/schemas/response/view_incident.response';

@Injectable()
/**
 * Use case to search and list incidents using dynamic filters (connectionId, status, priority, type).
 */
export class SearchIncidentsUseCase {
  constructor(
    @Inject('IncidentRepository')
    private readonly incidentRepository: InterfaceIncidentRepository,
  ) {}

  async execute(
    filters: {
      connectionId?: string | null;
      status?: string | null;
      priority?: string | null;
      categoryId?: number | null;
      sector?: string | null;
      reference?: string | null;
      reportDate?: Date | null;
      internalUserId?: string | null;
      externalUserId?: string | null;
      categoryCode?: string | null;
    },
    limit?: number | null,
    offset?: number | null,
  ): Promise<IncidentDetailRowResponse[]> {
    try {
      const models = await this.incidentRepository.findIncidents(
        filters,
        limit,
        offset,
      );
      return models;
    } catch (error) {
      throw error;
    }
  }
}
