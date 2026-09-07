import { Controller, Get, Post, Put } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UUID } from 'crypto';
import { CreateIncidentRequest } from '../../application/dtos/request/create-incident.request';
import { ResolveIncidentRequest } from '../../application/dtos/request/resolve-incident.request';
import { CreateIncidentUseCase } from '../../application/usecases/commands/CreateIncidentUseCase';
import { ResolveIncidentUseCase } from '../../application/usecases/commands/ResolveIncidentUseCase';
import { FindIncidentsByConnectionUseCase } from '../../application/usecases/queries/FindIncidentsByConnectionUseCase';
import { SearchIncidentsUseCase } from '../../application/usecases/queries/SearchIncidentsUseCase';
import { FindIncidentCategoriesUseCase } from '../../application/usecases/queries/FindIncidentCategoriesUseCase';
import { GetIncidentDashboardKpisUseCase } from '../../application/usecases/queries/GetIncidentDashboardKpisUseCase';
import { SearchIncidentsByClientIdUseCase } from '../../application/usecases/queries/SearchIncidentsByClientIdUseCase';

@Controller('Incidents')
export class IncidentController {
  constructor(
    private readonly createIncidentUseCase: CreateIncidentUseCase,
    private readonly resolveIncidentUseCase: ResolveIncidentUseCase,
    private readonly findIncidentsByConnectionUseCase: FindIncidentsByConnectionUseCase,
    private readonly searchIncidentsUseCase: SearchIncidentsUseCase,
    private readonly findIncidentCategoriesUseCase: FindIncidentCategoriesUseCase,
    private readonly getIncidentDashboardKpisUseCase: GetIncidentDashboardKpisUseCase,
    private readonly searchIncidentsByClientIdUseCase: SearchIncidentsByClientIdUseCase,
  ) {}

  @Get('dashboard/kpis')
  @MessagePattern('incident.dashboard-kpis')
  async getIncidentDashboardKpis() {
    return this.getIncidentDashboardKpisUseCase.execute();
  }

  @Post('create-incident')
  @MessagePattern('incident.create-incident')
  async createIncident(
    @Payload()
    payload: CreateIncidentRequest & {
      reporterUserId?: UUID;
      clienteUsuarioReportaId?: UUID;
    },
  ) {
    const { reporterUserId, clienteUsuarioReportaId, ...request } = payload;
    return this.createIncidentUseCase.execute(
      request,
      reporterUserId ?? null,
      clienteUsuarioReportaId ?? null,
    );
  }

  @Put('resolve-incident/:incidentId')
  @MessagePattern('incident.resolve-incident')
  async resolveIncident(
    @Payload()
    data: {
      incidentId: string;
      request: ResolveIncidentRequest;
      resolverUserId: UUID;
    },
  ) {
    return this.resolveIncidentUseCase.execute(
      data.incidentId,
      data.request,
      data.resolverUserId,
    );
  }

  @Get('find-by-connection/:connectionId')
  @MessagePattern('incident.find-by-connection')
  async findIncidentsByConnection(@Payload() connectionId: string) {
    return this.findIncidentsByConnectionUseCase.execute(connectionId);
  }

  @Get('search')
  @MessagePattern('incident.search')
  async searchIncidents(
    @Payload()
    payload: {
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
      limit?: number | null;
      offset?: number | null;
    }
  ) {
    const { limit, offset, ...filters } = payload;
    return this.searchIncidentsUseCase.execute(
      filters,
      limit ?? 25,
      offset ?? 0,
    );
  }

  @Get('search-by-client-id')
  @MessagePattern('incident.search-by-client-id')
  async searchIncidentsByClientId(
    @Payload()
    payload: {
      externalUserId: string;
      connectionId?: string | null;
      status?: string | null;
      priority?: string | null;
      categoryId?: number | null;
      sector?: string | null;
      reference?: string | null;
      reportDate?: Date | null;
      limit?: number | null;
      offset?: number | null;
    },
  ) {
    const { limit, offset, ...filters } = payload;
    return this.searchIncidentsByClientIdUseCase.execute(
      filters,
      limit ?? 25,
      offset ?? 0
    );
  }

  @Get('categories')
  @MessagePattern('incident.categories')
  async findIncidentCategories() {
    return this.findIncidentCategoriesUseCase.execute();
  }
}
