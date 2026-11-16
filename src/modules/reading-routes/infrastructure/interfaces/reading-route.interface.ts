export interface RouteConnectionSqlResult {
  id_ruta_acometida: number;
  ruta_id: number;
  acometida_id: string;
  orden_secuencia: number;
  lado_calle?: string;
  piso_departamento?: string;
  instruccion_acceso?: string;
  activo: boolean;
  sector?: string;
  cuenta?: string;
  numero_medidor?: string;
  abonado?: string;
  cliente_id?: string;
  direccion?: string;
  referencia?: string;
  latitud?: number;
  longitud?: number;
  consumo_promedio?: number;
}

export interface AsignacionRutaDetalleSqlResult {
  id_asignacion?: number;
  idAsignacion?: number;
  periodo: string; // O Date, dependiendo de cómo esté definido periodo_mes en tu BD
  fecha_programada?: string | Date | null;
  fechaProgramada?: string | Date | null;
  estado_asignacion?: string;
  estadoAsignacion?: string;
  total_predios?: number;
  totalPredios?: number;
  predios_leidos?: number;
  prediosLeidos?: number;
  predios_con_novedad?: number;
  prediosConNovedad?: number;
  predios_pendientes?: number;
  prediosPendientes?: number;
  porcentaje_avance?: number;
  porcentajeAvance?: number;
  id_ruta?: number;
  idRuta?: number;
  codigo_ruta?: string;
  codigoRuta?: string;
  nombre_ruta?: string;
  nombreRuta?: string;
  acometidas: AcometidaRutaDetalleSqlResult[];
}

export interface AcometidaRutaDetalleSqlResult {
  id_detalle?: number;
  idDetalle?: number;
  acometida_id?: number | string;
  acometidaId?: number | string;
  orden: number;
  cuenta?: string | number | null;
  numero_medidor?: string | null;
  numeroMedidor?: string | null;
  abonado: string;
  cliente_id?: string | number | null;
  clienteId?: string | number | null;
  direccion: string | null;
  referencia: string | null;
  latitud: number | null;
  longitud: number | null;
  lado_calle?: string | null;
  ladoCalle?: string | null;
  piso_departamento?: string | null;
  pisoDepartamento?: string | null;
  instruccion_acceso?: string | null;
  instruccionAcceso?: string | null;
  lectura_anterior?: number;
  lecturaAnterior?: number;
  consumo_promedio?: number | null;
  consumoPromedio?: number | null;
  estado: string | null;
  lectura_actual?: number | null;
  lecturaActual?: number | null;
  fecha_hora_captura?: string | Date | null;
  fechaHoraCaptura?: string | Date | null;
  tipo_novedad_lectura_id?: number | null;
  tipoNovedadLecturaId?: number | null;
  estado_lectura_id?: number | null;
  estadoLecturaId?: number | null;
  observaciones: string | null;
}
