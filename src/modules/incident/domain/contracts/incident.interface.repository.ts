import { UUID } from 'crypto';
import { IncidentModel } from '../schemas/model/incident.model';
import { IncidentCategoryModel } from '../schemas/model/incident-category-type.model';
import { IncidentDetailRowResponse } from '../schemas/response/view_incident.response';
import { IncidentDashboardResponseDto } from '../../application/dtos/response/incident-dashboard.dto';
import { IncidentChangeDetail } from '../../application/dtos/request/resolve-incident.request';

/**
 * Repository interface for Incident operations.
 */
export interface InterfaceIncidentRepository {
  getIncidentDashboardKpis(): Promise<IncidentDashboardResponseDto | null>;

  createIncident(
    incident: IncidentModel,
    images: string[],
  ): Promise<IncidentModel | null>;

  resolveIncident(
    incidentId: string,
    resolverUserId: UUID,
    description: string,
    repairCost: number,
    chargeToUser: boolean,
    images: string[],
    changeDetails?: IncidentChangeDetail[] | null,
  ): Promise<IncidentModel | null>;

  findIncidentsByConnection(
    connectionId: string,
  ): Promise<IncidentDetailRowResponse[]>;
  findById(incidentId: string): Promise<IncidentDetailRowResponse | null>;
  findIncidents(filters: {
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
  }): Promise<IncidentDetailRowResponse[]>;
  findIncidentsByClientUserId(filters: {
    externalUserId: string | null;
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
