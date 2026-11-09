import { Injectable, Logger } from '@nestjs/common';
import {
  InterfaceReadingAnalyticsRepository,
  ExecutiveDashboardFilter,
  SectorPerformanceFilter,
  MonthlyTrendFilter,
  NoveltyEconomicImpactFilter,
  TopConsumersFilter,
  InterannualComparisonFilter,
} from '../../../../domain/contracts/reading-analytics.interface.repository';
import { ExecutiveDashboardModel } from '../../../../domain/schemas/model/executive-dashboard.model';
import { SectorPerformanceModel } from '../../../../domain/schemas/model/sector-performance.model';
import { MonthlyTrendModel } from '../../../../domain/schemas/model/monthly-trend.model';
import { NoveltyEconomicImpactModel } from '../../../../domain/schemas/model/novelty-economic-impact.model';
import { TopConsumerModel } from '../../../../domain/schemas/model/top-consumer.model';
import { InterannualComparisonModel } from '../../../../domain/schemas/model/interannual-comparison.model';

import {
  ExecutiveDashboardSqlResult,
  SectorPerformanceSqlResult,
  MonthlyTrendSqlResult,
  NoveltyEconomicImpactSqlResult,
  TopConsumerSqlResult,
  InterannualComparisonSqlResult,
} from '../../../interfaces/sql/reading-analytics-sql.interface';
import { ReadingAnalyticsSQLAdapter } from '../../../adapters/reading-analytics-sql.adapter';
import { DatabaseAbstract } from '../../../../../../shared/connections/database/abstract/abstract.database';

@Injectable()
export class ReadingAnalyticsPostgreSQLPersistence
  implements InterfaceReadingAnalyticsRepository
{
  private readonly logger = new Logger(ReadingAnalyticsPostgreSQLPersistence.name);

  constructor(private readonly databaseService: DatabaseAbstract) {}

  async getExecutiveDashboard(
    filter: ExecutiveDashboardFilter,
  ): Promise<ExecutiveDashboardModel> {
    const params: (string | number)[] = [filter.month];
    let sectorFilter = '';

    if (filter.sector !== undefined && filter.sector !== null) {
      params.push(filter.sector);
      sectorFilter = `AND l.sector = $${params.length}`;
    }

    const query = `
      WITH lecturas_mes AS (
        SELECT
          l.lectura_id,
          l.sector,
          l.cuenta,
          l.clave_catastral,
          l.valor_lectura AS valor_agua,
          l.tasa_alcantarillado AS valor_alcantarillado,
          COALESCE(l.valor_lectura, 0) + COALESCE(l.tasa_alcantarillado, 0) AS total_facturado,
          CASE
            WHEN l.lectura_actual >= l.lectura_anterior THEN (l.lectura_actual - l.lectura_anterior)
            ELSE 0
          END AS m3_consumidos,
          l.novedad,
          l.fecha_lectura
        FROM public.lectura l
        WHERE l.mes_lectura = $1
        ${sectorFilter}
      )
      SELECT
        $1                                                                  AS periodo_analizado,
        COUNT(*)                                                            AS total_lecturas_tomadas,
        COUNT(DISTINCT sector)                                              AS total_sectores_cubiertos,
        COUNT(DISTINCT clave_catastral)                                     AS total_acometidas_activas,
        ROUND(COALESCE(SUM(m3_consumidos), 0), 2)                           AS volumen_total_m3,
        ROUND(COALESCE(AVG(m3_consumidos), 0), 2)                           AS consumo_promedio_por_cuenta_m3,
        ROUND(COALESCE(MIN(m3_consumidos), 0), 2)                           AS consumo_minimo_m3,
        ROUND(COALESCE(MAX(m3_consumidos), 0), 2)                           AS consumo_maximo_m3,
        ROUND(COALESCE(SUM(valor_agua), 0), 2)                              AS recaudacion_agua_usd,
        ROUND(COALESCE(SUM(valor_alcantarillado), 0), 2)                    AS recaudacion_alcantarillado_usd,
        ROUND(COALESCE(SUM(total_facturado), 0), 2)                         AS facturacion_total_usd,
        ROUND(COALESCE(AVG(total_facturado), 0), 2)                         AS ticket_promedio_por_cuenta_usd,
        CASE
          WHEN COALESCE(SUM(m3_consumidos), 0) > 0
          THEN ROUND(SUM(valor_agua) / SUM(m3_consumidos), 4)
          ELSE 0
        END                                                                 AS tarifa_efectiva_media_usd_m3,
        COUNT(*) FILTER (WHERE novedad NOT IN ('NORMAL', 'LECTURA NORMAL')) AS total_lecturas_con_novedad,
        ROUND(
          (COUNT(*) FILTER (WHERE novedad NOT IN ('NORMAL', 'LECTURA NORMAL'))::numeric / NULLIF(COUNT(*), 0)) * 100,
          2
        )                                                                   AS porcentaje_novedad_operativa
      FROM lecturas_mes;
    `;

    const results = await this.databaseService.query<ExecutiveDashboardSqlResult>(
      query,
      params,
    );

    if (results.length === 0) {
      return new ExecutiveDashboardModel(
        filter.month,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      );
    }

    return ReadingAnalyticsSQLAdapter.toExecutiveDashboardModel(results[0]);
  }

  async getSectorPerformance(
    filter: SectorPerformanceFilter,
  ): Promise<SectorPerformanceModel[]> {
    const params: (string | number)[] = [filter.month];
    let sectorFilter = '';

    if (filter.sector !== undefined && filter.sector !== null) {
      params.push(filter.sector);
      sectorFilter = `AND l.sector = $${params.length}`;
    }

    let orderByClause = 'ORDER BY ms.total_facturado_usd DESC';
    if (filter.sortBy === 'volume') {
      orderByClause = 'ORDER BY ms.m3_consumidos DESC';
    } else if (filter.sortBy === 'readings') {
      orderByClause = 'ORDER BY ms.cantidad_lecturas DESC';
    } else if (filter.sortBy === 'sector') {
      orderByClause = 'ORDER BY ms.sector ASC';
    }

    const query = `
      WITH metricas_sector AS (
        SELECT
          l.sector,
          COUNT(l.lectura_id)                                             AS cantidad_lecturas,
          SUM(
            CASE
              WHEN l.lectura_actual >= l.lectura_anterior THEN (l.lectura_actual - l.lectura_anterior)
              ELSE 0
            END
          )                                                               AS m3_consumidos,
          ROUND(AVG(
            CASE
              WHEN l.lectura_actual >= l.lectura_anterior THEN (l.lectura_actual - l.lectura_anterior)
              ELSE 0
            END
          ), 2)                                                           AS consumo_promedio_m3,
          SUM(COALESCE(l.valor_lectura, 0))                               AS total_agua_usd,
          SUM(COALESCE(l.tasa_alcantarillado, 0))                         AS total_alcantarillado_usd,
          SUM(COALESCE(l.valor_lectura, 0) + COALESCE(l.tasa_alcantarillado, 0)) AS total_facturado_usd,
          COUNT(*) FILTER (WHERE l.novedad NOT IN ('NORMAL', 'LECTURA NORMAL')) AS novedades_sector
        FROM public.lectura l
        WHERE l.mes_lectura = $1
        ${sectorFilter}
        GROUP BY l.sector
      )
      SELECT
        ms.sector,
        ms.cantidad_lecturas,
        ms.m3_consumidos,
        ms.consumo_promedio_m3,
        ROUND(ms.total_agua_usd, 2)                                         AS total_agua_usd,
        ROUND(ms.total_alcantarillado_usd, 2)                               AS total_alcantarillado_usd,
        ROUND(ms.total_facturado_usd, 2)                                    AS total_facturado_usd,
        ROUND(
          (ms.total_facturado_usd / NULLIF(SUM(ms.total_facturado_usd) OVER (), 0)) * 100,
          2
        )                                                                   AS pct_aporte_ingresos,
        ROUND(
          (ms.m3_consumidos / NULLIF(SUM(ms.m3_consumidos) OVER (), 0)) * 100,
          2
        )                                                                   AS pct_aporte_volumen_m3,
        CASE
          WHEN ms.m3_consumidos > 0
          THEN ROUND((ms.total_agua_usd / ms.m3_consumidos)::numeric, 4)
          ELSE 0
        END                                                                 AS tarifa_promedio_usd_m3,
        ms.novedades_sector,
        ROUND((ms.novedades_sector::numeric / NULLIF(ms.cantidad_lecturas, 0)) * 100, 2) AS pct_incidencias,
        DENSE_RANK() OVER (ORDER BY ms.total_facturado_usd DESC)            AS rank_recaudacion,
        DENSE_RANK() OVER (ORDER BY ms.m3_consumidos DESC)                  AS rank_consumo_m3
      FROM metricas_sector ms
      ${orderByClause};
    `;

    const results = await this.databaseService.query<SectorPerformanceSqlResult>(
      query,
      params,
    );

    return ReadingAnalyticsSQLAdapter.toSectorPerformanceModelList(results);
  }

  async getMonthlyTrend(
    filter: MonthlyTrendFilter,
  ): Promise<MonthlyTrendModel[]> {
    let startMonth = filter.startMonth;
    let endMonth = filter.endMonth;

    if (filter.year !== undefined && filter.year !== null) {
      startMonth = `${filter.year}-01`;
      endMonth = `${filter.year}-12`;
    } else {
      if (!startMonth) startMonth = '2026-01';
      if (!endMonth) endMonth = '2026-12';
    }

    const params: (string | number)[] = [startMonth, endMonth];
    let sectorFilter = '';

    if (filter.sector !== undefined && filter.sector !== null) {
      params.push(filter.sector);
      sectorFilter = `AND l.sector = $${params.length}`;
    }

    const query = `
      WITH resumen_mensual AS (
        SELECT
          l.mes_lectura,
          COUNT(l.lectura_id)                                             AS total_lecturas,
          SUM(
            CASE
              WHEN l.lectura_actual >= l.lectura_anterior THEN (l.lectura_actual - l.lectura_anterior)
              ELSE 0
            END
          )                                                               AS m3_totales,
          SUM(COALESCE(l.valor_lectura, 0))                               AS ingreso_agua,
          SUM(COALESCE(l.tasa_alcantarillado, 0))                         AS ingreso_alcantarillado,
          SUM(COALESCE(l.valor_lectura, 0) + COALESCE(l.tasa_alcantarillado, 0)) AS ingreso_total
        FROM public.lectura l
        WHERE l.mes_lectura >= $1 AND l.mes_lectura <= $2
        ${sectorFilter}
        GROUP BY l.mes_lectura
      )
      SELECT
        rm.mes_lectura,
        rm.total_lecturas,
        ROUND(rm.m3_totales, 2)                                             AS m3_totales,
        ROUND(
          rm.m3_totales - LAG(rm.m3_totales) OVER (ORDER BY rm.mes_lectura),
          2
        )                                                                   AS delta_volumen_m3,
        ROUND(
          ((rm.m3_totales - LAG(rm.m3_totales) OVER (ORDER BY rm.mes_lectura))
          / NULLIF(LAG(rm.m3_totales) OVER (ORDER BY rm.mes_lectura), 0)) * 100,
          2
        )                                                                   AS pct_crecimiento_m3,
        ROUND(rm.ingreso_agua, 2)                                           AS ingreso_agua_usd,
        ROUND(rm.ingreso_alcantarillado, 2)                                 AS ingreso_alcantarillado_usd,
        ROUND(rm.ingreso_total, 2)                                          AS ingreso_total_usd,
        ROUND(
          rm.ingreso_total - LAG(rm.ingreso_total) OVER (ORDER BY rm.mes_lectura),
          2
        )                                                                   AS delta_ingresos_usd,
        ROUND(
          ((rm.ingreso_total - LAG(rm.ingreso_total) OVER (ORDER BY rm.mes_lectura))
          / NULLIF(LAG(rm.ingreso_total) OVER (ORDER BY rm.mes_lectura), 0)) * 100,
          2
        )                                                                   AS pct_crecimiento_ingresos
      FROM resumen_mensual rm
      ORDER BY rm.mes_lectura ASC;
    `;

    const results = await this.databaseService.query<MonthlyTrendSqlResult>(
      query,
      params,
    );

    return ReadingAnalyticsSQLAdapter.toMonthlyTrendModelList(results);
  }

  async getNoveltyEconomicImpact(
    filter: NoveltyEconomicImpactFilter,
  ): Promise<NoveltyEconomicImpactModel[]> {
    const params: (string | number)[] = [filter.month];
    let sectorFilter = '';

    if (filter.sector !== undefined && filter.sector !== null) {
      params.push(filter.sector);
      sectorFilter = `AND l.sector = $${params.length}`;
    }

    const query = `
      SELECT
        COALESCE(l.novedad, 'SIN NOVEDAD ESPECIFICADA')                    AS novedad_lectura,
        COUNT(*)                                                            AS conteo_casos,
        ROUND((COUNT(*)::numeric / NULLIF(SUM(COUNT(*)) OVER (), 0)) * 100, 2) AS pct_del_total_lecturas,
        ROUND(SUM(
          CASE
            WHEN l.lectura_actual >= l.lectura_anterior THEN (l.lectura_actual - l.lectura_anterior)
            ELSE 0
          END
        ), 2)                                                               AS m3_totales_novedad,
        ROUND(AVG(
          CASE
            WHEN l.lectura_actual >= l.lectura_anterior THEN (l.lectura_actual - l.lectura_anterior)
            ELSE 0
          END
        ), 2)                                                               AS m3_promedio_por_caso,
        ROUND(SUM(COALESCE(l.valor_lectura, 0)), 2)                         AS total_agua_usd,
        ROUND(SUM(COALESCE(l.tasa_alcantarillado, 0)), 2)                   AS total_alcantarillado_usd,
        ROUND(SUM(COALESCE(l.valor_lectura, 0) + COALESCE(l.tasa_alcantarillado, 0)), 2) AS facturacion_total_usd
      FROM public.lectura l
      WHERE l.mes_lectura = $1
      ${sectorFilter}
      GROUP BY l.novedad
      ORDER BY conteo_casos DESC;
    `;

    const results =
      await this.databaseService.query<NoveltyEconomicImpactSqlResult>(
        query,
        params,
      );

    return ReadingAnalyticsSQLAdapter.toNoveltyEconomicImpactModelList(results);
  }

  async getTopConsumers(
    filter: TopConsumersFilter,
  ): Promise<TopConsumerModel[]> {
    const params: (string | number)[] = [filter.month];
    let dynamicFilter = '';

    if (filter.sector !== undefined && filter.sector !== null) {
      params.push(filter.sector);
      dynamicFilter += ` AND l.sector = $${params.length}`;
    }

    if (
      filter.minConsumptionM3 !== undefined &&
      filter.minConsumptionM3 !== null
    ) {
      params.push(filter.minConsumptionM3);
      dynamicFilter += ` AND (l.lectura_actual - l.lectura_anterior) >= $${params.length}`;
    }

    if (filter.novelty) {
      params.push(filter.novelty);
      dynamicFilter += ` AND l.novedad = $${params.length}`;
    }

    const limit = Math.max(1, Math.min(filter.limit ?? 50, 500));
    params.push(limit);
    const limitPlaceholder = `$${params.length}`;

    const query = `
      SELECT
        l.lectura_id,
        l.sector,
        l.cuenta,
        l.clave_catastral,
        l.acometida_id,
        ac.numero_medidor,
        ac.direccion,
        COALESCE(ci.nombres || ' ' || ci.apellidos, emp.razon_social, 'PROPIETARIO NO REGISTRADO') AS cliente,
        l.lectura_anterior,
        l.lectura_actual,
        (l.lectura_actual - l.lectura_anterior)                             AS m3_consumidos,
        ROUND(l.valor_lectura, 2)                                           AS valor_agua_usd,
        ROUND(l.tasa_alcantarillado, 2)                                     AS valor_alcantarillado_usd,
        ROUND(COALESCE(l.valor_lectura, 0) + COALESCE(l.tasa_alcantarillado, 0), 2) AS total_facturado_usd,
        l.novedad,
        l.fecha_lectura,
        public.ST_AsText(l.ubicacion_captura)                              AS coordenadas_gps
      FROM public.lectura l
      INNER JOIN public.acometida ac          ON l.acometida_id = ac.acometida_id
      LEFT JOIN public.cliente c              ON ac.cliente_id = c.cliente_id
      LEFT JOIN public.ciudadano ci           ON ci.ciudadano_id = c.cliente_id
      LEFT JOIN public.empresa emp            ON emp.ruc = c.cliente_id
      WHERE l.mes_lectura = $1
      ${dynamicFilter}
      ORDER BY (l.lectura_actual - l.lectura_anterior) DESC
      LIMIT ${limitPlaceholder};
    `;

    const results = await this.databaseService.query<TopConsumerSqlResult>(
      query,
      params,
    );

    return ReadingAnalyticsSQLAdapter.toTopConsumerModelList(results);
  }

  async getInterannualComparison(
    filter: InterannualComparisonFilter,
  ): Promise<InterannualComparisonModel[]> {
    const baseYear = filter.baseYear ?? 2025;
    const targetYear = filter.targetYear ?? 2026;
    const startMonth = String(filter.startMonthNumber ?? 1).padStart(2, '0');
    const endMonth = String(filter.endMonthNumber ?? 10).padStart(2, '0');

    const baseStart = `${baseYear}-${startMonth}`;
    const baseEnd = `${baseYear}-${endMonth}`;
    const targetStart = `${targetYear}-${startMonth}`;
    const targetEnd = `${targetYear}-${endMonth}`;

    const onlyHomologous = filter.onlyHomologous !== false;
    const params: (string | number)[] = [baseStart, baseEnd, targetStart, targetEnd];
    let sectorFilter = '';

    if (filter.sector !== undefined && filter.sector !== null) {
      params.push(filter.sector);
      sectorFilter = `AND sector = $${params.length}`;
    }

    let query: string;

    if (onlyHomologous) {
      // 1-to-1 Paired Homologous comparison matching sector, account, cadastral key and corresponding month
      query = `
        WITH paired_readings AS (
          SELECT
            l25.sector,
            l25.cuenta,
            l25.clave_catastral,
            l25.acometida_id,
            SUBSTRING(l25.mes_lectura, 6, 2) AS month_num,
            CASE WHEN l25.lectura_actual >= l25.lectura_anterior THEN (l25.lectura_actual - l25.lectura_anterior) ELSE 0 END AS m3_2025,
            COALESCE(l25.valor_lectura, 0) + COALESCE(l25.tasa_alcantarillado, 0) AS facturado_2025_usd,
            CASE WHEN l26.lectura_actual >= l26.lectura_anterior THEN (l26.lectura_actual - l26.lectura_anterior) ELSE 0 END AS m3_2026,
            COALESCE(l26.valor_lectura, 0) + COALESCE(l26.tasa_alcantarillado, 0) AS facturado_2026_usd
          FROM public.lectura l25
          INNER JOIN public.lectura l26
            ON l25.sector = l26.sector
            AND l25.cuenta = l26.cuenta
            AND l25.clave_catastral = l26.clave_catastral
            AND SUBSTRING(l25.mes_lectura, 6, 2) = SUBSTRING(l26.mes_lectura, 6, 2)
          WHERE l25.mes_lectura >= $1 AND l25.mes_lectura <= $2
            AND l26.mes_lectura >= $3 AND l26.mes_lectura <= $4
        )
        SELECT
          sector,
          COUNT(DISTINCT acometida_id)                                        AS acometidas_homologas,
          COUNT(*)                                                            AS lecturas_2025,
          COUNT(*)                                                            AS lecturas_2026,
          0                                                                   AS delta_lecturas,
          COALESCE(SUM(m3_2025), 0)                                           AS m3_2025,
          COALESCE(SUM(m3_2026), 0)                                           AS m3_2026,
          (COALESCE(SUM(m3_2026), 0) - COALESCE(SUM(m3_2025), 0))             AS delta_m3,
          ROUND(((COALESCE(SUM(m3_2026), 0) - COALESCE(SUM(m3_2025), 0))::numeric * 100.0) / NULLIF(COALESCE(SUM(m3_2025), 0), 0), 2) AS pct_var_m3,
          ROUND(COALESCE(SUM(facturado_2025_usd), 0), 2)                      AS facturado_2025_usd,
          ROUND(COALESCE(SUM(facturado_2026_usd), 0), 2)                      AS facturado_2026_usd,
          ROUND(COALESCE(SUM(facturado_2026_usd), 0) - COALESCE(SUM(facturado_2025_usd), 0), 2) AS delta_facturado_usd,
          ROUND(((COALESCE(SUM(facturado_2026_usd), 0) - COALESCE(SUM(facturado_2025_usd), 0)) * 100.0) / NULLIF(COALESCE(SUM(facturado_2025_usd), 0), 0), 2) AS pct_var_facturado,
          CASE
            WHEN ((COALESCE(SUM(facturado_2026_usd), 0) - COALESCE(SUM(facturado_2025_usd), 0)) * 100.0) / NULLIF(COALESCE(SUM(facturado_2025_usd), 0), 0) > 15.0
              THEN 'ALTA RECUPERACION (>+15%)'
            WHEN ((COALESCE(SUM(facturado_2026_usd), 0) - COALESCE(SUM(facturado_2025_usd), 0)) * 100.0) / NULLIF(COALESCE(SUM(facturado_2025_usd), 0), 0) < -10.0
              THEN 'CAIDA RECAUDACION (<-10%)'
            ELSE 'ESTABLE / CRECIMIENTO MODERADO'
          END AS diagnostico_gestion
        FROM paired_readings
        WHERE 1 = 1
        ${sectorFilter}
        GROUP BY sector
        ORDER BY sector;
      `;
    } else {
      // Macro comparison by sector
      query = `
        WITH resumen_base AS (
          SELECT
            l.sector,
            COUNT(DISTINCT l.acometida_id) AS acometidas_totales,
            COUNT(l.lectura_id) AS lecturas_base,
            SUM(CASE WHEN l.lectura_actual >= l.lectura_anterior THEN (l.lectura_actual - l.lectura_anterior) ELSE 0 END) AS m3_base,
            ROUND(SUM(COALESCE(l.valor_lectura, 0) + COALESCE(l.tasa_alcantarillado, 0)), 2) AS facturado_base_usd
          FROM public.lectura l
          WHERE l.mes_lectura >= $1 AND l.mes_lectura <= $2
          GROUP BY l.sector
        ),
        resumen_target AS (
          SELECT
            l.sector,
            COUNT(DISTINCT l.acometida_id) AS acometidas_totales,
            COUNT(l.lectura_id) AS lecturas_target,
            SUM(CASE WHEN l.lectura_actual >= l.lectura_anterior THEN (l.lectura_actual - l.lectura_anterior) ELSE 0 END) AS m3_target,
            ROUND(SUM(COALESCE(l.valor_lectura, 0) + COALESCE(l.tasa_alcantarillado, 0)), 2) AS facturado_target_usd
          FROM public.lectura l
          WHERE l.mes_lectura >= $3 AND l.mes_lectura <= $4
          GROUP BY l.sector
        )
        SELECT
          COALESCE(t.sector, b.sector) AS sector,
          COALESCE(t.acometidas_totales, b.acometidas_totales, 0) AS acometidas_homologas,
          COALESCE(b.lecturas_base, 0) AS lecturas_2025,
          COALESCE(t.lecturas_target, 0) AS lecturas_2026,
          (COALESCE(t.lecturas_target, 0) - COALESCE(b.lecturas_base, 0)) AS delta_lecturas,
          COALESCE(b.m3_base, 0) AS m3_2025,
          COALESCE(t.m3_target, 0) AS m3_2026,
          (COALESCE(t.m3_target, 0) - COALESCE(b.m3_base, 0)) AS delta_m3,
          ROUND(((COALESCE(t.m3_target, 0) - COALESCE(b.m3_base, 0))::numeric * 100.0) / NULLIF(COALESCE(b.m3_base, 0), 0), 2) AS pct_var_m3,
          COALESCE(b.facturado_base_usd, 0) AS facturado_2025_usd,
          COALESCE(t.facturado_target_usd, 0) AS facturado_2026_usd,
          ROUND((COALESCE(t.facturado_target_usd, 0) - COALESCE(b.facturado_base_usd, 0)), 2) AS delta_facturado_usd,
          ROUND(((COALESCE(t.facturado_target_usd, 0) - COALESCE(b.facturado_base_usd, 0)) * 100.0) / NULLIF(COALESCE(b.facturado_base_usd, 0), 0), 2) AS pct_var_facturado,
          CASE
            WHEN ((COALESCE(t.facturado_target_usd, 0) - COALESCE(b.facturado_base_usd, 0)) * 100.0) / NULLIF(COALESCE(b.facturado_base_usd, 0), 0) > 15.0
              THEN 'ALTA RECUPERACION (>+15%)'
            WHEN ((COALESCE(t.facturado_target_usd, 0) - COALESCE(b.facturado_base_usd, 0)) * 100.0) / NULLIF(COALESCE(b.facturado_base_usd, 0), 0) < -10.0
              THEN 'CAIDA RECAUDACION (<-10%)'
            ELSE 'ESTABLE / CRECIMIENTO MODERADO'
          END AS diagnostico_gestion
        FROM resumen_target t
        FULL OUTER JOIN resumen_base b ON t.sector = b.sector
        WHERE 1 = 1
        ${sectorFilter ? sectorFilter.replace('sector', 'COALESCE(t.sector, b.sector)') : ''}
        ORDER BY COALESCE(t.sector, b.sector);
      `;
    }

    const results =
      await this.databaseService.query<InterannualComparisonSqlResult>(
        query,
        params,
      );

    return ReadingAnalyticsSQLAdapter.toInterannualComparisonModelList(results);
  }
}
