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

@Controller('Incidents')
export class IncidentController {
  constructor(
    private readonly createIncidentUseCase: CreateIncidentUseCase,
    private readonly resolveIncidentUseCase: ResolveIncidentUseCase,
    private readonly findIncidentsByConnectionUseCase: FindIncidentsByConnectionUseCase,
    private readonly searchIncidentsUseCase: SearchIncidentsUseCase,
    private readonly findIncidentCategoriesUseCase: FindIncidentCategoriesUseCase,
  ) {}

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
      incidentId: number;
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
    filters: {
      connectionId?: string | null;
      status?: string | null;
      priority?: string | null;
      incidentTypeId?: number | null;
    },
  ) {
    return this.searchIncidentsUseCase.execute(filters);
  }

  @Get('categories')
  @MessagePattern('incident.categories')
  async findIncidentCategories() {
    return this.findIncidentCategoriesUseCase.execute();
  }
}
