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
