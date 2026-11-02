import { RouteAssignmentEntity } from '../entities/route-assignment.entity';

export const ROUTE_ASSIGNMENT_REPOSITORY = 'RouteAssignmentRepository';

export interface BatchDispatchItemResult {
  idAsignacion: number;
  codigoRuta: string;
  lecturistaId: string;
  nombreLecturista?: string;
  totalPredios: number;
}

export interface BatchDispatchSummaryResult {
  success: boolean;
  message: string;
  periodo: string;
  totalRutasAsignadas: number;
  totalAcometidasDespachadas: number;
  rutasDespachadas: BatchDispatchItemResult[];
}

export interface ReassignSegmentResult {
  success: boolean;
  nuevaAsignacionId: number;
  asignacionOrigenId: number;
  prediosTransferidos: number;
  message: string;
}

export interface SyncBatchReadingInput {
  idDetalleAvance: number;
  acometidaId: string;
  lecturaActual: number;
  fechaHoraCaptura: string;
  latitudGps?: number;
  longitudGps?: number;
  novedadId?: string;
  fotoEvidenciaUrl?: string;
  observaciones?: string;
}

export interface SyncBatchResult {
  success: boolean;
  totalSincronizados: number;
  totalExitosos: number;
  totalFallidos: number;
  errores: Array<{ idDetalleAvance: number; acometidaId: string; error: string }>;
}

export interface IRouteAssignmentRepository {
  executeMorningBatchDispatch(
    sectorId: number | null,
    periodoMes: string,
    fechaProgramada: Date,
    lecturistaIds: string[],
    supervisorId: string,
  ): Promise<BatchDispatchSummaryResult>;

  assignSingleRoute(
    rutaId: number,
    usuarioId: string,
    periodoMes: string,
    fechaProgramada: Date,
    supervisorId: string,
  ): Promise<number>;

  reassignRouteSegment(
    asignacionOrigenId: number,
    nuevoUsuarioId: string,
    motivo: string,
    supervisorId: string,
  ): Promise<ReassignSegmentResult>;

  getLiveTracking(periodoMes?: string, fecha?: string): Promise<RouteAssignmentEntity[]>;

  cancelAssignment(idAsignacion: number, motivo?: string, supervisorId?: string): Promise<boolean>;

  resumeAssignment(
    idAsignacion: number,
    motivo?: string,
    supervisorId?: string,
  ): Promise<{
    success: boolean;
    idAsignacion: number;
    nuevoEstado: string;
    message: string;
  }>;

  getMobileWorkPack(idAsignacion: number): Promise<any>;

  syncMobileReadingsBatch(
    asignacionId: number,
    lecturas: SyncBatchReadingInput[],
    usuarioId: string,
  ): Promise<SyncBatchResult>;

  getLecturistDailyKpi(usuarioId: string, fecha?: string): Promise<any>;
}
