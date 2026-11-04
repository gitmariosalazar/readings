export class BatchMorningDispatchRequest {
  zonaId?: number;
  sectorId?: number;
  periodo!: string;
  fechaProgramada!: string;
  lecturistaIds!: string[];
  observaciones?: string;
}

export class AssignSingleRouteRequest {
  rutaId!: number;
  usuarioId!: string;
  periodo!: string;
  fechaProgramada!: string;
}

export class ReassignRouteSegmentRequest {
  asignacionId!: number;
  nuevoUsuarioId!: string;
  motivo!: string;
}

export class ResolveRouteRequest {
  latitud!: number;
  longitud!: number;
  sector?: number;
  acometidaId?: string;
}

export class InsertConnectionIntoRouteRequest {
  idRuta!: number;
  acometidaId!: string;
  ordenSugerido?: number;
  ladoCalle?: string;
  instruccionAcceso?: string;
}

export class OptimizeRouteSequenceRequest {
  idRuta!: number;
  acometidaInicio?: string;
}

export class SingleMobileReadingItemDto {
  idDetalleAvance!: number;
  acometidaId!: string;
  lecturaActual!: number;
  fechaHoraCaptura!: string;
  latitudGps?: number;
  longitudGps?: number;
  novedadId?: string;
  fotoEvidenciaUrl?: string;
  observaciones?: string;
}

export class SyncMobileReadingsBatchRequest {
  asignacionId!: number;
  lecturas!: SingleMobileReadingItemDto[];
}

export class FindReadingRoutesQueryRequest {
  sectorId?: number;
  activa?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export class GetLecturistAssignedRoutesRequest {
  usuarioId!: string;
  fecha?: string;
  periodoMes?: string;
}
