import { Module } from '@nestjs/common';
import { IncidentController } from '../../controllers/incident.controller';
import { IncidentPersistencePostgreSQL } from '../../repositories/postgresql/persistence/incident-postgresql.persistence';
import { CreateIncidentUseCase } from '../../../application/usecases/commands/CreateIncidentUseCase';
import { ResolveIncidentUseCase } from '../../../application/usecases/commands/ResolveIncidentUseCase';
import { FindIncidentsByConnectionUseCase } from '../../../application/usecases/queries/FindIncidentsByConnectionUseCase';
import { SearchIncidentsUseCase } from '../../../application/usecases/queries/SearchIncidentsUseCase';
import { FindIncidentCategoriesUseCase } from '../../../application/usecases/queries/FindIncidentCategoriesUseCase';
import { GetIncidentDashboardKpisUseCase } from '../../../application/usecases/queries/GetIncidentDashboardKpisUseCase';
import { SearchIncidentsByClientIdUseCase } from '../../../application/usecases/queries/SearchIncidentsByClientIdUseCase';

@Module({
  controllers: [IncidentController],
  providers: [
    CreateIncidentUseCase,
    ResolveIncidentUseCase,
    FindIncidentsByConnectionUseCase,
    SearchIncidentsUseCase,
    FindIncidentCategoriesUseCase,
    GetIncidentDashboardKpisUseCase,
    SearchIncidentsByClientIdUseCase,
    {
      provide: 'IncidentRepository',
      useClass: IncidentPersistencePostgreSQL,
    },
  ],
  exports: [
    'IncidentRepository',
    CreateIncidentUseCase,
    ResolveIncidentUseCase,
    FindIncidentsByConnectionUseCase,
    SearchIncidentsUseCase,
    SearchIncidentsByClientIdUseCase,
    FindIncidentCategoriesUseCase,
    GetIncidentDashboardKpisUseCase,
  ],
})
export class IncidentModuleUsingPostgreSQL {}
