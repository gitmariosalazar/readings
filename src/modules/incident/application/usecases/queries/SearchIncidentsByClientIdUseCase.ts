import { Inject, Injectable } from '@nestjs/common';
import { IncidentResponse } from '../../dtos/response/incident.response';
import { InterfaceIncidentRepository } from '../../../domain/contracts/incident.interface.repository';
import { IncidentMapper } from '../../mappers/incident.mapper';
import { IncidentDetailRowResponse } from '../../../domain/schemas/response/view_incident.response';

@Injectable()
/**
 * Use case to search and list incidents using dynamic filters (connectionId, status, priority, type).
 */
export class SearchIncidentsByClientIdUseCase {
  constructor(
    @Inject('IncidentRepository')
    private readonly incidentRepository: InterfaceIncidentRepository,
  ) {}

  async execute(filters: {
    externalUserId: string | null;
    connectionId?: string | null;
    status?: string | null;
    priority?: string | null;
    categoryId?: number | null;
    sector?: string | null;
    reference?: string | null;
    reportDate?: Date | null;
  }, limit?: number | null, offset?: number | null): Promise<{ items: IncidentDetailRowResponse[]; totalCount: number }> {
    try {
      const models =
        await this.incidentRepository.findIncidentsByClientUserId(filters, limit, offset);
      return models;
    } catch (error) {
      throw error;
    }
  }
}
