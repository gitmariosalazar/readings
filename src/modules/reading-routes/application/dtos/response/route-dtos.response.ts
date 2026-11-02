export interface DispatchedRouteSummaryDto {
  idAsignacion: number;
  codigoRuta: string;
  lecturistaId: string;
  nombreLecturista?: string | undefined;
  totalPredios: number;
}

export interface BatchDispatchResponse {
  success: boolean;
  message: string;
  periodo: string;
  totalRutasAsignadas: number;
  totalAcometidasDespachadas: number;
  rutasDespachadas: DispatchedRouteSummaryDto[];
}

export interface ReassignRouteSegmentResponse {
  success: boolean;
  nuevaAsignacionId: number;
  asignacionOrigenId: number;
  prediosTransferidos: number;
  message: string;
}

export interface ResolvedRouteResponse {
  idRuta: number;
  codigoRuta: string;
  nombreRuta: string;
  sectorId: number;
  metodoResolucion: string;
  distanciaMetros: number;
  ordenSugerido: number;
}

export interface OptimizeRouteSequenceResponse {
  success: boolean;
  idRuta: number;
  totalReordenadas: number;
  distanciaTotalCaminadaMetros: number;
  message: string;
}

export interface LecturistDailyKpiResponse {
  usuarioId: string;
  fecha: string;
  rutasAsignadas: number;
  totalPrediosAsignados: number;
  totalPrediosLeidos: number;
  totalNovedades: number;
  totalPendientes: number;
  porcentajeEfectividad: number;
  horaPrimeraLectura?: string | null;
  horaUltimaLectura?: string | null;
}

export interface RouteConnectionResponse {
  idRutaAcometida: number;
  rutaId: number;
  acometidaId: string;
  ordenSecuencia: number;
  ladoCalle?: string;
  pisoDepartamento?: string;
  instruccionAcceso?: string;
  activo: boolean;
  cuenta?: string;
  numeroMedidor?: string;
  abonado?: string;
  direccion?: string;
  referencia?: string;
  latitud?: number;
  longitud?: number;
  consumoPromedio?: number;
}
