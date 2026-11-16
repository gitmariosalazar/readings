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
  sector?: string;
  cuenta?: string;
  numeroMedidor?: string;
  abonado?: string;
  clienteId?: string;
  direccion?: string;
  referencia?: string;
  latitud?: number;
  longitud?: number;
  consumoPromedio?: number;
}

export interface AsignacionRutaDetalle {
  idAsignacion: number;
  periodo: string; // O Date, dependiendo de cómo esté definido periodo_mes en tu BD
  fechaProgramada: string | Date | null;
  estadoAsignacion: string;
  totalPredios: number;
  prediosLeidos: number;
  prediosConNovedad: number;
  prediosPendientes: number;
  porcentajeAvance: number;
  idRuta: number;
  codigoRuta: string;
  nombreRuta: string;
  acometidas: AcometidaRutaDetalle[];
}

export interface AcometidaRutaDetalle {
  idDetalle: number;
  acometidaId: number | string;
  orden: number;
  cuenta: string | null;
  numeroMedidor: string | null;
  abonado: string;
  clienteId: string | number | null;
  direccion: string | null;
  referencia: string | null;
  latitud: number | null;
  longitud: number | null;
  ladoCalle: string | null;
  pisoDepartamento: string | null;
  instruccionAcceso: string | null;
  lecturaAnterior: number;
  consumoPromedio: number | null;
  estado: string | null;
  lecturaActual: number | null;
  fechaHoraCaptura: string | Date | null;
  tipoNovedadLecturaId: number | null;
  estadoLecturaId: number | null;
  observaciones: string | null;
}
