export interface ExecutiveDashboardSqlResult {
  periodo_analizado: string;
  total_lecturas_tomadas: string | number;
  total_sectores_cubiertos: string | number;
  total_acometidas_activas: string | number;
  volumen_total_m3: string | number;
  consumo_promedio_por_cuenta_m3: string | number;
  consumo_minimo_m3: string | number;
  consumo_maximo_m3: string | number;
  recaudacion_agua_usd: string | number;
  recaudacion_alcantarillado_usd: string | number;
  facturacion_total_usd: string | number;
  ticket_promedio_por_cuenta_usd: string | number;
  tarifa_efectiva_media_usd_m3: string | number;
  total_lecturas_con_novedad: string | number;
  porcentaje_novedad_operativa: string | number;
}

export interface SectorPerformanceSqlResult {
  sector: string | number;
  cantidad_lecturas: string | number;
  m3_consumidos: string | number;
  consumo_promedio_m3: string | number;
  total_agua_usd: string | number;
  total_alcantarillado_usd: string | number;
  total_facturado_usd: string | number;
  pct_aporte_ingresos: string | number;
  pct_aporte_volumen_m3: string | number;
  tarifa_promedio_usd_m3: string | number;
  novedades_sector: string | number;
  pct_incidencias: string | number;
  rank_recaudacion: string | number;
  rank_consumo_m3: string | number;
}

export interface MonthlyTrendSqlResult {
  mes_lectura: string;
  total_lecturas: string | number;
  m3_totales: string | number;
  delta_volumen_m3: string | number | null;
  pct_crecimiento_m3: string | number | null;
  ingreso_agua_usd: string | number;
  ingreso_alcantarillado_usd: string | number;
  ingreso_total_usd: string | number;
  delta_ingresos_usd: string | number | null;
  pct_crecimiento_ingresos: string | number | null;
}

export interface NoveltyEconomicImpactSqlResult {
  novedad_lectura: string;
  conteo_casos: string | number;
  pct_del_total_lecturas: string | number;
  m3_totales_novedad: string | number;
  m3_promedio_por_caso: string | number;
  total_agua_usd: string | number;
  total_alcantarillado_usd: string | number;
  facturacion_total_usd: string | number;
}

export interface TopConsumerSqlResult {
  lectura_id: string | number;
  sector: string | number;
  cuenta: string | number;
  clave_catastral: string;
  acometida_id: string;
  numero_medidor: string | null;
  direccion: string | null;
  cliente: string;
  lectura_anterior: string | number;
  lectura_actual: string | number;
  m3_consumidos: string | number;
  valor_agua_usd: string | number;
  valor_alcantarillado_usd: string | number;
  total_facturado_usd: string | number;
  novedad: string | null;
  fecha_lectura: string | Date;
  coordenadas_gps: string | null;
}

export interface InterannualComparisonSqlResult {
  sector: string | number;
  acometidas_homologas: string | number;
  lecturas_2025: string | number;
  lecturas_2026: string | number;
  delta_lecturas: string | number;
  m3_2025: string | number;
  m3_2026: string | number;
  delta_m3: string | number;
  pct_var_m3: string | number;
  facturado_2025_usd: string | number;
  facturado_2026_usd: string | number;
  delta_facturado_usd: string | number;
  pct_var_facturado: string | number;
  diagnostico_gestion: string;
}
