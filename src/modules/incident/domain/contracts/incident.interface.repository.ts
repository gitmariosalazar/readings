import { UUID } from 'crypto';
import { IncidentModel } from '../schemas/model/incident.model';
import { IncidentCategoryModel } from '../schemas/model/incident-category-type.model';
import { IncidentDetailRowResponse } from '../schemas/response/view_incident.response';

/**
 * Repository interface for Incident operations.
 */
export interface InterfaceIncidentRepository {
  createIncident(
    incident: IncidentModel,
    images: string[],
  ): Promise<IncidentModel | null>;

  resolveIncident(
    incidentId: number,
    resolverUserId: UUID,
    description: string,
    repairCost: number,
    chargeToUser: boolean,
    images: string[],
  ): Promise<IncidentModel | null>;

  findIncidentsByConnection(
    connectionId: string,
  ): Promise<IncidentDetailRowResponse[]>;
  findById(incidentId: number): Promise<IncidentDetailRowResponse | null>;
  findIncidents(filters: {
    connectionId?: string | null;
    status?: string | null;
    priority?: string | null;
    categoryId?: number | null;
    sector?: string | null;
    reference?: string | null;
    reportDate?: Date | null;
  }): Promise<IncidentDetailRowResponse[]>;
  findIncidentCategories(): Promise<IncidentCategoryModel[]>;
}
