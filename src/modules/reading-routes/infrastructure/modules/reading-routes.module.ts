import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { environments } from '../../../../settings/environments/environments';
import { DatabasePersistenceModule } from '../../../../shared/connections/database/database-persistence.module';

// Controllers
import { ReadingRouteCatalogController } from '../controllers/reading-route-catalog.controller';
import { RouteDispatchController } from '../controllers/route-dispatch.controller';
import { RouteResolutionController } from '../controllers/route-resolution.controller';
import { MobileRouteSyncController } from '../controllers/mobile-route-sync.controller';

// Contracts & Ports
import { READING_ROUTE_REPOSITORY } from '../../domain/contracts/reading-route.repository.interface';
import { ROUTE_ASSIGNMENT_REPOSITORY } from '../../domain/contracts/route-assignment.repository.interface';
import { READING_LEGACY_PUBLISHER_PORT } from '../../application/ports/reading-legacy-publisher.port';

// Strategies
import { PointInPolygonStrategy } from '../strategies/point-in-polygon.strategy';
import { NearestCentroidKnnStrategy } from '../strategies/nearest-centroid-knn.strategy';
import { SectorCadastralFallbackStrategy } from '../strategies/sector-cadastral-fallback.strategy';

// Persistence Repositories & Adapters
import { PostgresqlReadingRouteRepository } from '../persistence/postgresql-reading-route.repository';
import { PostgresqlRouteAssignmentRepository } from '../persistence/postgresql-route-assignment.repository';
import { KafkaReadingLegacyPublisherAdapter } from '../adapters/kafka-reading-legacy-publisher.adapter';

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
import { GetLecturistAssignedRoutesUseCase } from '../../application/usecases/queries/GetLecturistAssignedRoutesUseCase';

@Module({
  imports: [
    DatabasePersistenceModule,
    ClientsModule.register([
      {
        name: environments.READINGS_KAFKA_CLIENT,
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [environments.KAFKA_BROKER_URL],
            clientId: `${environments.READINGS_KAFKA_CLIENT_ID}-publisher`,
          },
          producerOnlyMode: true,
        },
      },
    ]),
  ],
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
    {
      provide: READING_LEGACY_PUBLISHER_PORT,
      useClass: KafkaReadingLegacyPublisherAdapter,
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
    GetLecturistAssignedRoutesUseCase,
  ],
  exports: [
    READING_ROUTE_REPOSITORY,
    ROUTE_ASSIGNMENT_REPOSITORY,
    READING_LEGACY_PUBLISHER_PORT,
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
    GetLecturistAssignedRoutesUseCase,
  ],
})
export class ReadingRoutesModule {}
