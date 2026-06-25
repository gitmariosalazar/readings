import { UUID } from 'crypto';
import { IncidentModel } from '../schemas/model/incident.model';
import { IncidentCategoryModel } from '../schemas/model/incident-category-type.model';

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

  findIncidentsByConnection(connectionId: string): Promise<IncidentModel[]>;
  findById(incidentId: number): Promise<IncidentModel | null>;
  findIncidents(filters: {
    connectionId?: string | null;
    status?: string | null;
    priority?: string | null;
    incidentTypeId?: number | null;
  }): Promise<IncidentModel[]>;
  findIncidentCategories(): Promise<IncidentCategoryModel[]>;
}
