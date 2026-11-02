import { Module } from '@nestjs/common';
import { DatabasePersistenceModule } from '../../../../shared/connections/database/database-persistence.module';

// Controllers
import { ReadingRouteCatalogController } from '../controllers/reading-route-catalog.controller';
import { RouteDispatchController } from '../controllers/route-dispatch.controller';
import { RouteResolutionController } from '../controllers/route-resolution.controller';
import { MobileRouteSyncController } from '../controllers/mobile-route-sync.controller';

// Contracts
import { READING_ROUTE_REPOSITORY } from '../../domain/contracts/reading-route.repository.interface';
import { ROUTE_ASSIGNMENT_REPOSITORY } from '../../domain/contracts/route-assignment.repository.interface';

// Strategies
import { PointInPolygonStrategy } from '../strategies/point-in-polygon.strategy';
import { NearestCentroidKnnStrategy } from '../strategies/nearest-centroid-knn.strategy';
import { SectorCadastralFallbackStrategy } from '../strategies/sector-cadastral-fallback.strategy';

// Persistence Repositories
import { PostgresqlReadingRouteRepository } from '../persistence/postgresql-reading-route.repository';
import { PostgresqlRouteAssignmentRepository } from '../persistence/postgresql-route-assignment.repository';

// Command Use Cases
import { BatchMorningDispatchUseCase } from '../../application/usecases/commands/BatchMorningDispatchUseCase';
import { AssignSingleRouteUseCase } from '../../application/usecases/commands/AssignSingleRouteUseCase';
import { ReassignRouteSegmentUseCase } from '../../application/usecases/commands/ReassignRouteSegmentUseCase';
import { CancelRouteAssignmentUseCase } from '../../application/usecases/commands/CancelRouteAssignmentUseCase';
import { ResumeRouteAssignmentUseCase } from '../../application/usecases/commands/ResumeRouteAssignmentUseCase';
import { ResolveRouteForConnectionUseCase } from '../../application/usecases/commands/ResolveRouteForConnectionUseCase';
import { InsertConnectionIntoRouteUseCase } from '../../application/usecases/commands/InsertConnectionIntoRouteUseCase';
import { OptimizeRouteSequenceUseCase } from '../../application/usecases/commands/OptimizeRouteSequenceUseCase';
import { SyncMobileReadingsBatchUseCase } from '../../application/usecases/commands/SyncMobileReadingsBatchUseCase';

// Query Use Cases
import { FindReadingRoutesUseCase } from '../../application/usecases/queries/FindReadingRoutesUseCase';
import { GetRouteByIdUseCase } from '../../application/usecases/queries/GetRouteByIdUseCase';
import { GetRoutesGeoJsonUseCase } from '../../application/usecases/queries/GetRoutesGeoJsonUseCase';
import { GetRouteCentroidsGeoJsonUseCase } from '../../application/usecases/queries/GetRouteCentroidsGeoJsonUseCase';
import { GetRouteConnectionsUseCase } from '../../application/usecases/queries/GetRouteConnectionsUseCase';
import { GetLiveTrackingAssignmentsUseCase } from '../../application/usecases/queries/GetLiveTrackingAssignmentsUseCase';
import { GetMobileWorkPackUseCase } from '../../application/usecases/queries/GetMobileWorkPackUseCase';
import { GetLecturistDailyKpiUseCase } from '../../application/usecases/queries/GetLecturistDailyKpiUseCase';

@Module({
  imports: [DatabasePersistenceModule],
  controllers: [
    ReadingRouteCatalogController,
    RouteDispatchController,
    RouteResolutionController,
    MobileRouteSyncController,
  ],
  providers: [
    // Strategies (SOLID - Open/Closed Principle)
    PointInPolygonStrategy,
    NearestCentroidKnnStrategy,
    SectorCadastralFallbackStrategy,
    {
      provide: 'ROUTE_RESOLUTION_STRATEGIES',
      useFactory: (
        p: PointInPolygonStrategy,
        k: NearestCentroidKnnStrategy,
        s: SectorCadastralFallbackStrategy,
      ) => [p, k, s],
      inject: [
        PointInPolygonStrategy,
        NearestCentroidKnnStrategy,
        SectorCadastralFallbackStrategy,
      ],
    },

    // Repositories (SOLID - Dependency Inversion & Liskov Substitution)
    {
      provide: READING_ROUTE_REPOSITORY,
      useClass: PostgresqlReadingRouteRepository,
    },
    {
      provide: ROUTE_ASSIGNMENT_REPOSITORY,
      useClass: PostgresqlRouteAssignmentRepository,
    },

    // Command Use Cases (SOLID - Single Responsibility Principle)
    BatchMorningDispatchUseCase,
    AssignSingleRouteUseCase,
    ReassignRouteSegmentUseCase,
    CancelRouteAssignmentUseCase,
    ResumeRouteAssignmentUseCase,
    ResolveRouteForConnectionUseCase,
    InsertConnectionIntoRouteUseCase,
    OptimizeRouteSequenceUseCase,
    SyncMobileReadingsBatchUseCase,

    // Query Use Cases
    FindReadingRoutesUseCase,
    GetRouteByIdUseCase,
    GetRoutesGeoJsonUseCase,
    GetRouteCentroidsGeoJsonUseCase,
    GetRouteConnectionsUseCase,
    GetLiveTrackingAssignmentsUseCase,
    GetMobileWorkPackUseCase,
    GetLecturistDailyKpiUseCase,
  ],
  exports: [
    READING_ROUTE_REPOSITORY,
    ROUTE_ASSIGNMENT_REPOSITORY,
    BatchMorningDispatchUseCase,
    AssignSingleRouteUseCase,
    ReassignRouteSegmentUseCase,
    CancelRouteAssignmentUseCase,
    ResumeRouteAssignmentUseCase,
    ResolveRouteForConnectionUseCase,
    InsertConnectionIntoRouteUseCase,
    OptimizeRouteSequenceUseCase,
    SyncMobileReadingsBatchUseCase,
    FindReadingRoutesUseCase,
    GetRouteByIdUseCase,
    GetRoutesGeoJsonUseCase,
    GetRouteCentroidsGeoJsonUseCase,
    GetRouteConnectionsUseCase,
    GetLiveTrackingAssignmentsUseCase,
    GetMobileWorkPackUseCase,
    GetLecturistDailyKpiUseCase,
  ],
})
export class ReadingRoutesModule {}
