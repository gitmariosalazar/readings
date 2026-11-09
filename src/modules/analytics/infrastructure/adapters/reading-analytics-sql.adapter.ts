import { ExecutiveDashboardModel } from '../../domain/schemas/model/executive-dashboard.model';
import { SectorPerformanceModel } from '../../domain/schemas/model/sector-performance.model';
import { MonthlyTrendModel } from '../../domain/schemas/model/monthly-trend.model';
import { NoveltyEconomicImpactModel } from '../../domain/schemas/model/novelty-economic-impact.model';
import { TopConsumerModel } from '../../domain/schemas/model/top-consumer.model';
import { InterannualComparisonModel } from '../../domain/schemas/model/interannual-comparison.model';

import {
  ExecutiveDashboardSqlResult,
  SectorPerformanceSqlResult,
  MonthlyTrendSqlResult,
  NoveltyEconomicImpactSqlResult,
  TopConsumerSqlResult,
  InterannualComparisonSqlResult,
} from '../interfaces/sql/reading-analytics-sql.interface';

function parseNumber(value: string | number | null | undefined, defaultValue = 0): number {
  if (value === null || value === undefined) return defaultValue;
  if (typeof value === 'number') return isNaN(value) ? defaultValue : value;
  const parsed = parseFloat(String(value).trim());
  return isNaN(parsed) ? defaultValue : parsed;
}

function parseNullableNumber(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return isNaN(value) ? null : value;
  const str = String(value).trim();
  if (str === '') return null;
  const parsed = parseFloat(str);
  return isNaN(parsed) ? null : parsed;
}

export class ReadingAnalyticsSQLAdapter {
  static parseNumber = parseNumber;
  static parseNullableNumber = parseNullableNumber;

  static toExecutiveDashboardModel(
    sqlResult: ExecutiveDashboardSqlResult,
  ): ExecutiveDashboardModel {
    return new ExecutiveDashboardModel(
      sqlResult.periodo_analizado ?? '',
      parseNumber(sqlResult.total_lecturas_tomadas),
      parseNumber(sqlResult.total_sectores_cubiertos),
      parseNumber(sqlResult.total_acometidas_activas),
      parseNumber(sqlResult.volumen_total_m3),
      parseNumber(sqlResult.consumo_promedio_por_cuenta_m3),
      parseNumber(sqlResult.consumo_minimo_m3),
      parseNumber(sqlResult.consumo_maximo_m3),
      parseNumber(sqlResult.recaudacion_agua_usd),
      parseNumber(sqlResult.recaudacion_alcantarillado_usd),
      parseNumber(sqlResult.facturacion_total_usd),
      parseNumber(sqlResult.ticket_promedio_por_cuenta_usd),
      parseNumber(sqlResult.tarifa_efectiva_media_usd_m3),
      parseNumber(sqlResult.total_lecturas_con_novedad),
      parseNumber(sqlResult.porcentaje_novedad_operativa),
    );
  }

  static toSectorPerformanceModel(
    sqlResult: SectorPerformanceSqlResult,
  ): SectorPerformanceModel {
    return new SectorPerformanceModel(
      parseNumber(sqlResult.sector),
      parseNumber(sqlResult.cantidad_lecturas),
      parseNumber(sqlResult.m3_consumidos),
      parseNumber(sqlResult.consumo_promedio_m3),
      parseNumber(sqlResult.total_agua_usd),
      parseNumber(sqlResult.total_alcantarillado_usd),
      parseNumber(sqlResult.total_facturado_usd),
      parseNumber(sqlResult.pct_aporte_ingresos),
      parseNumber(sqlResult.pct_aporte_volumen_m3),
      parseNumber(sqlResult.tarifa_promedio_usd_m3),
      parseNumber(sqlResult.novedades_sector),
      parseNumber(sqlResult.pct_incidencias),
      parseNumber(sqlResult.rank_recaudacion),
      parseNumber(sqlResult.rank_consumo_m3),
    );
  }

  static toSectorPerformanceModelList(
    rows: SectorPerformanceSqlResult[],
  ): SectorPerformanceModel[] {
    return rows.map((r) => ReadingAnalyticsSQLAdapter.toSectorPerformanceModel(r));
  }

  static toMonthlyTrendModel(
    sqlResult: MonthlyTrendSqlResult,
  ): MonthlyTrendModel {
    return new MonthlyTrendModel(
      sqlResult.mes_lectura ?? '',
      parseNumber(sqlResult.total_lecturas),
      parseNumber(sqlResult.m3_totales),
      parseNullableNumber(sqlResult.delta_volumen_m3),
      parseNullableNumber(sqlResult.pct_crecimiento_m3),
      parseNumber(sqlResult.ingreso_agua_usd),
      parseNumber(sqlResult.ingreso_alcantarillado_usd),
      parseNumber(sqlResult.ingreso_total_usd),
      parseNullableNumber(sqlResult.delta_ingresos_usd),
      parseNullableNumber(sqlResult.pct_crecimiento_ingresos),
    );
  }

  static toMonthlyTrendModelList(
    rows: MonthlyTrendSqlResult[],
  ): MonthlyTrendModel[] {
    return rows.map((r) => ReadingAnalyticsSQLAdapter.toMonthlyTrendModel(r));
  }

  static toNoveltyEconomicImpactModel(
    sqlResult: NoveltyEconomicImpactSqlResult,
  ): NoveltyEconomicImpactModel {
    return new NoveltyEconomicImpactModel(
      sqlResult.novedad_lectura ?? 'SIN NOVEDAD',
      parseNumber(sqlResult.conteo_casos),
      parseNumber(sqlResult.pct_del_total_lecturas),
      parseNumber(sqlResult.m3_totales_novedad),
      parseNumber(sqlResult.m3_promedio_por_caso),
      parseNumber(sqlResult.total_agua_usd),
      parseNumber(sqlResult.total_alcantarillado_usd),
      parseNumber(sqlResult.facturacion_total_usd),
    );
  }

  static toNoveltyEconomicImpactModelList(
    rows: NoveltyEconomicImpactSqlResult[],
  ): NoveltyEconomicImpactModel[] {
    return rows.map((r) => ReadingAnalyticsSQLAdapter.toNoveltyEconomicImpactModel(r));
  }

  static toTopConsumerModel(
    sqlResult: TopConsumerSqlResult,
  ): TopConsumerModel {
    const readingDateStr =
      sqlResult.fecha_lectura instanceof Date
        ? sqlResult.fecha_lectura.toISOString()
        : String(sqlResult.fecha_lectura ?? '');

    return new TopConsumerModel(
      parseNumber(sqlResult.lectura_id),
      parseNumber(sqlResult.sector),
      parseNumber(sqlResult.cuenta),
      sqlResult.clave_catastral ?? '',
      sqlResult.acometida_id ?? '',
      sqlResult.numero_medidor ?? '',
      sqlResult.direccion ?? '',
      sqlResult.cliente ?? 'PROPIETARIO NO REGISTRADO',
      parseNumber(sqlResult.lectura_anterior),
      parseNumber(sqlResult.lectura_actual),
      parseNumber(sqlResult.m3_consumidos),
      parseNumber(sqlResult.valor_agua_usd),
      parseNumber(sqlResult.valor_alcantarillado_usd),
      parseNumber(sqlResult.total_facturado_usd),
      sqlResult.novedad ?? 'NORMAL',
      readingDateStr,
      sqlResult.coordenadas_gps,
    );
  }

  static toTopConsumerModelList(
    rows: TopConsumerSqlResult[],
  ): TopConsumerModel[] {
    return rows.map((r) => ReadingAnalyticsSQLAdapter.toTopConsumerModel(r));
  }

  static toInterannualComparisonModel(
    sqlResult: InterannualComparisonSqlResult,
  ): InterannualComparisonModel {
    return new InterannualComparisonModel(
      parseNumber(sqlResult.sector),
      parseNumber(sqlResult.acometidas_homologas),
      parseNumber(sqlResult.lecturas_2025),
      parseNumber(sqlResult.lecturas_2026),
      parseNumber(sqlResult.delta_lecturas),
      parseNumber(sqlResult.m3_2025),
      parseNumber(sqlResult.m3_2026),
      parseNumber(sqlResult.delta_m3),
      parseNumber(sqlResult.pct_var_m3),
      parseNumber(sqlResult.facturado_2025_usd),
      parseNumber(sqlResult.facturado_2026_usd),
      parseNumber(sqlResult.delta_facturado_usd),
      parseNumber(sqlResult.pct_var_facturado),
      sqlResult.diagnostico_gestion ?? '',
    );
  }

  static toInterannualComparisonModelList(
    rows: InterannualComparisonSqlResult[],
  ): InterannualComparisonModel[] {
    return rows.map((r) => ReadingAnalyticsSQLAdapter.toInterannualComparisonModel(r));
  }
}
