import { Injectable } from '@nestjs/common';
import { InterfaceReadingReportRepository } from '../../../../domain/contracts/reading-report.interface.repository';
import { ConnectionLastReadingsReportModel } from '../../../../domain/schemas/model/report/connection-last-readings.model';
import { DailyReadingsReportModel } from '../../../../domain/schemas/model/report/daily-readings.model';
import { YearlyReadingsReportModel } from '../../../../domain/schemas/model/report/yearly-readings.model';
import { DashboardMetricsModel } from '../../../../domain/schemas/model/report/dashboard-metrics.model';
import { GlobalStatsReportModel } from '../../../../domain/schemas/model/report/global-stats.model';
import { DailyStatsReportModel } from '../../../../domain/schemas/model/report/daily-stats.model';
import { SectorStatsReportModel } from '../../../../domain/schemas/model/report/sector-stats.model';
import { NoveltyStatsReportModel } from '../../../../domain/schemas/model/report/novelty-stats.model';
import { AdvancedReportReadingsModel } from '../../../../domain/schemas/model/report/advanced-report-readings.model';
import { DatabaseServicePostgreSQL } from '../../../../../../shared/connections/database/postgresql/postgresql.service';
import {
  AdvancedReportReadingsSQLResult,
  MonthlySummarySQLResult,
} from '../../../interfaces/sql/reading-sql.result.interface';
import { ReadingPostgreSQLAdapter } from '../adapters/reading-postgresql.adapter';
import { ReadingAuditMapper } from '../adapters/reading-postgresql.audit.adapter';
import {
  AuditSectorHistoryModel,
  AuditSectorModel,
  CloseAuditSectorModel,
  InitializeAuditModel,
} from '../../../../domain/schemas/model/report/audit-sector.model';
import {
  AuditSectorHistorySqlResult,
  AuditSectorSqlResult,
  CloseAuditSectorSqlResult,
} from '../../../interfaces/sql/reading-sql.audit.interface';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from '../../../../../../settings/environments/status-code';

@Injectable()
export class ReadingReportPostgreSQLPersistence
  implements InterfaceReadingReportRepository
{
  constructor(private readonly postgresqlService: DatabaseServicePostgreSQL) {}

  /**
   * Helper: SQL fragment for the "connection existed in this month" rule.
   *
   * Business rule:
   *  - Migrated connections (fecha_inicio_lecturas IS NULL) → always included.
   *  - New connections → included only when fecha_inicio_lecturas <= last day of queried month.
   *
   * param placeholder  The $N positional parameter that holds the YYYY-MM string.
   */
  private readonly periodFilter = (placeholder: string) => `
    (
      ac.fecha_inicio_lecturas IS NULL
      OR ac.fecha_inicio_lecturas
         <= (date_trunc('month', (${placeholder}::text || '-01')::date) + interval '1 month - 1 day')::date
    )
  `;

  /**
   * Helper: SQL fragment for reliable reading date range.
   * Double-filters on mes_lectura AND the real fecha_lectura range to guard
   * against historically mis-tagged rows imported from legacy systems.
   *
   * param placeholder  The $N positional parameter that holds the YYYY-MM string.
   */
  private readonly lecturaMonthFilter = (placeholder: string) => `
    mes_lectura = ${placeholder}
    AND fecha_lectura >= date_trunc('month', (${placeholder}::text || '-01')::date)
    AND fecha_lectura  < date_trunc('month', (${placeholder}::text || '-01')::date) + interval '1 month'
  `;

  // ─────────────────────────────────────────────────────────────────────────────
  // ADVANCED REPORT: sector-level reading progress for a given month
  // ─────────────────────────────────────────────────────────────────────────────
  async findAdvancedReportReadings(
    month: string,
  ): Promise<AdvancedReportReadingsModel[]> {
    const query = `
      SELECT
          s.sector,

          -- Total readable connections that existed during the queried month
          COALESCE(a.total_readable_units, 0)                                               AS total_connections,

          -- Unique connections that were actually read (DISTINCT avoids re-reading inflation)
          COALESCE(l.readings_completed, 0)                                                 AS readings_completed,

          -- Connections still pending a reading
          COALESCE(a.total_readable_units, 0) - COALESCE(l.readings_completed, 0)           AS missing_readings,

          -- Progress %: completed / readable (capped logic: readable is the universe)
          CASE
              WHEN COALESCE(a.total_readable_units, 0) = 0 THEN 0
              ELSE ROUND(COALESCE(l.readings_completed, 0) * 100.0 / a.total_readable_units, 1)
          END                                                                               AS progress_percentage,

          -- Strictly ACTIVA connections (estado_id = 1) for internal KPI comparison
          COALESCE(a.pure_active_units, 0)                                                  AS pure_active_units,

          -- Connections with special readable states (suspended, arrears, etc.) that still get read
          COALESCE(a.special_status_with_reading, 0)                                        AS suspended_or_arrears_with_reading,

          -- Data quality signal: positive = more readings than connections (anomaly)
          (COALESCE(l.readings_completed, 0) - COALESCE(a.total_readable_units, 0))         AS data_discrepancy,

          -- Field efficiency: same formula as progress_percentage (readable universe)
          CASE
              WHEN COALESCE(a.total_readable_units, 0) = 0 THEN 0
              ELSE ROUND(COALESCE(l.readings_completed, 0) * 100.0 / a.total_readable_units, 1)
          END                                                                               AS total_visit_efficiency,

          -- Audit table cross-reference: expected vs completed as recorded by auditoria_lectura_sector
          COALESCE(aud.total_esperado, 0)                                                   AS audit_total_esperado,
          COALESCE(aud.total_completadas, 0)                                                AS audit_total_completadas,
          COALESCE(aud.avance_porcentaje, 0)                                                AS audit_avance_porcentaje,
          COALESCE(aud.completo, FALSE)                                                     AS audit_completo

      FROM
          -- 1. Sectors with at least one readable connection that existed during the queried month
          (SELECT DISTINCT ac.sector
           FROM acometida ac
           JOIN cat_estados_acometida est ON ac.estado_id = est.id_estado
           WHERE est.permite_lectura = TRUE
             AND (
                 ac.fecha_inicio_lecturas IS NULL
                 OR ac.fecha_inicio_lecturas
                    <= (date_trunc('month', ($1::text || '-01')::date) + interval '1 month - 1 day')::date
             )
          ) s

      LEFT JOIN
          -- 2. Aggregated connection counts per sector for the queried month
          (SELECT
               ac.sector,
               COUNT(*)                                                          AS total_readable_units,
               SUM(CASE WHEN ac.estado_id = 1  THEN 1 ELSE 0 END)               AS pure_active_units,
               SUM(CASE WHEN ac.estado_id <> 1 THEN 1 ELSE 0 END)               AS special_status_with_reading
           FROM acometida ac
           JOIN cat_estados_acometida est ON ac.estado_id = est.id_estado
           WHERE est.permite_lectura = TRUE
             AND (
                 ac.fecha_inicio_lecturas IS NULL
                 OR ac.fecha_inicio_lecturas
                    <= (date_trunc('month', ($1::text || '-01')::date) + interval '1 month - 1 day')::date
             )
           GROUP BY ac.sector
          ) a ON a.sector = s.sector

      LEFT JOIN
          -- 3. Unique connections read in the queried month
          --    Double filter (mes_lectura + fecha_lectura range) guards against mis-tagged legacy rows
          (SELECT
               sector,
               COUNT(DISTINCT acometida_id) AS readings_completed
           FROM lectura
           WHERE mes_lectura = $1
             AND fecha_lectura >= date_trunc('month', ($1::text || '-01')::date)
             AND fecha_lectura  < date_trunc('month', ($1::text || '-01')::date) + interval '1 month'
           GROUP BY sector
          ) l ON l.sector = s.sector

      LEFT JOIN
          -- 4. Audit table for cross-validation (may be empty for historical months)
          auditoria_lectura_sector aud
              ON aud.sector_id = s.sector
             AND aud.mes_lectura = $1

      ORDER BY s.sector;
    `;

    const result =
      await this.postgresqlService.query<AdvancedReportReadingsSQLResult>(
        query,
        [month],
      );

    if (result.length === 0) {
      throw new Error('No se encontraron lecturas');
    }

    const response: AdvancedReportReadingsModel[] = result.map((row) =>
      ReadingPostgreSQLAdapter.fromReadingPostgreSQLResultToAdvancedReportReadingsModel(
        row,
      ),
    );

    return response;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // LAST READINGS BY CONNECTION (cadastral key)
  // ─────────────────────────────────────────────────────────────────────────────
  async findLastReadingsByConnection(
    cadastralKey: string,
    limit: number,
  ): Promise<ConnectionLastReadingsReportModel[]> {
    const query = `
      SELECT
        l.lectura_id                                                          AS "readingId",
        l.fecha_lectura                                                       AS "readingDate",
        l.valor_lectura                                                       AS "readingValue",
        (l.lectura_actual - l.lectura_anterior)                               AS "consumption",
        COALESCE(ci.nombres || ' ' || ci.apellidos, e.razon_social)          AS "clientName",
        l.clave_catastral                                                     AS "cadastralKey",
        ac.numero_medidor                                                     AS "meterNumber",
        ac.direccion                                                          AS "address",
        l.novedad                                                             AS "novelty",
        l.lectura_anterior                                                    AS "previewReading",
        l.lectura_actual                                                      AS "currentReading",
        c.cliente_id                                                          AS "clientId",
        cp.average_consumption                                                AS "averageConsumption",
        -- Additional context: current connection state
        est.nombre                                                            AS "connectionStatus",
        est.permite_lectura                                                   AS "isReadable"
      FROM lectura l
      INNER JOIN acometida ac       ON l.acometida_id = ac.acometida_id
      INNER JOIN consumo_promedio cp ON ac.acometida_id = cp.acometida_id
      LEFT JOIN  cat_estados_acometida est ON ac.estado_id = est.id_estado
      LEFT JOIN  cliente c           ON ac.cliente_id = c.cliente_id
      LEFT JOIN  ciudadano ci        ON ci.ciudadano_id = c.cliente_id
      LEFT JOIN  empresa e           ON e.ruc = c.cliente_id
      WHERE l.clave_catastral = $1
      ORDER BY l.fecha_lectura DESC
      LIMIT $2;
    `;

    const result = await this.postgresqlService.query<any>(query, [
      cadastralKey,
      limit,
    ]);

    return result.map((row) => ({
      ...row,
      readingDate: new Date(row.readingDate),
    }));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // DAILY READINGS (by specific date)
  // ─────────────────────────────────────────────────────────────────────────────
  async findReadingsByDate(date: string): Promise<DailyReadingsReportModel[]> {
    const startOfDay = `${date} 00:00:00`;
    const endOfDay = `${date} 23:59:59.999`;

    const query = `
      SELECT
        l.lectura_id                                                          AS "readingId",
        l.hora_lectura                                                        AS "readingTime",
        l.clave_catastral                                                     AS "cadastralKey",
        COALESCE(ci.nombres || ' ' || ci.apellidos, e.razon_social)          AS "clientName",
        l.valor_lectura                                                       AS "readingValue",
        (l.lectura_actual - l.lectura_anterior)                               AS "consumption",
        l.novedad                                                             AS "novelty",
        l.lectura_anterior                                                    AS "previewReading",
        l.lectura_actual                                                      AS "currentReading",
        c.cliente_id                                                          AS "clientId",
        cp.average_consumption                                                AS "averageConsumption"
      FROM lectura l
      INNER JOIN acometida ac         ON l.acometida_id = ac.acometida_id
      INNER JOIN consumo_promedio cp   ON ac.acometida_id = cp.acometida_id
      LEFT JOIN  cliente c             ON ac.cliente_id = c.cliente_id
      LEFT JOIN  ciudadano ci          ON ci.ciudadano_id = c.cliente_id
      LEFT JOIN  empresa e             ON e.ruc = c.cliente_id
      WHERE l.fecha_lectura >= $1::timestamp
        AND l.fecha_lectura  < $2::timestamp
    `;

    const result = await this.postgresqlService.query<DailyReadingsReportModel>(
      query,
      [startOfDay, endOfDay],
    );
    return result;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // YEARLY REPORT (monthly summaries for a given year)
  // ─────────────────────────────────────────────────────────────────────────────
  async findYearlyReport(year: number): Promise<YearlyReadingsReportModel> {
    const query = `
      WITH YearlyData AS (
          SELECT
              mes_lectura                          AS month_period,
              lectura_id,
              (lectura_actual - lectura_anterior)  AS consumption,
              novedad                              AS status_note
          FROM lectura
          -- Range filter is index-friendly for character(7) mes_lectura
          WHERE mes_lectura >= ($1::text || '-01')
            AND mes_lectura <= ($1::text || '-12')
            -- Also validate via real date to avoid mis-tagged legacy rows
            AND fecha_lectura >= make_date($1::int, 1, 1)
            AND fecha_lectura  < make_date($1::int + 1, 1, 1)
      ),
      MonthlyMetrics AS (
          SELECT
              month_period,
              COUNT(lectura_id)                                              AS total_readings,
              COALESCE(SUM(consumption), 0)                                  AS total_consumption,
              ROUND(AVG(consumption)::numeric, 2)                            AS avg_consumption,
              MAX(consumption)                                               AS max_consumption,
              MIN(consumption)                                               AS min_consumption,
              COUNT(*) FILTER (WHERE status_note NOT IN ('NORMAL', 'LECTURA NORMAL')) AS incident_count
          FROM YearlyData
          GROUP BY month_period
      )
      SELECT
          month_period                                                        AS "month",
          total_readings                                                      AS "total_readings",
          total_consumption                                                   AS "total_consumption",
          avg_consumption                                                     AS "average_consumption",
          max_consumption                                                     AS "max_consumption",
          min_consumption                                                     AS "min_consumption",
          incident_count                                                      AS "incident_count",
          CASE
              WHEN total_readings > 0
              THEN ROUND((incident_count::numeric / total_readings) * 100, 2)
              ELSE 0
          END                                                                 AS "incident_rate_percentage"
      FROM MonthlyMetrics
      ORDER BY month_period ASC;
    `;

    const result = await this.postgresqlService.query<MonthlySummarySQLResult>(
      query,
      [year],
    );

    const monthlySummaries = result.map((row) =>
      ReadingPostgreSQLAdapter.fromMonthlySummarySQLResultToMonthlySummaryModel(
        row,
      ),
    );

    const totalReadings = monthlySummaries.reduce(
      (sum, m) => sum + Number(m.totalReadings),
      0,
    );
    const totalConsumption = monthlySummaries.reduce(
      (sum, m) => sum + Number(m.totalConsumption),
      0,
    );

    return {
      year,
      totalReadings,
      averageConsumption:
        totalReadings > 0 ? totalConsumption / totalReadings : 0,
      monthlySummaries,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // DASHBOARD METRICS (from a given date onwards)
  // ─────────────────────────────────────────────────────────────────────────────
  async findDashboardMetrics(date: string): Promise<DashboardMetricsModel> {
    // Total readings taken from $1 onwards
    const queryTotal = `
      SELECT COUNT(*) AS count
      FROM lectura
      WHERE DATE(fecha_lectura) >= $1
    `;

    // Readings with an anomaly/novelty (excluding normal readings)
    const queryNovelty = `
      SELECT COUNT(*) AS count
      FROM lectura
      WHERE DATE(fecha_lectura) >= $1
        AND novedad NOT IN ('NORMAL', 'LECTURA NORMAL')
    `;

    // Pending connections: readable connections that have NOT been read yet today
    // (useful for live dashboard on the current day)
    const queryPending = `
      SELECT COUNT(*) AS count
      FROM acometida ac
      JOIN cat_estados_acometida est ON ac.estado_id = est.id_estado
      WHERE est.permite_lectura = TRUE
        AND NOT EXISTS (
            SELECT 1 FROM lectura l
            WHERE l.acometida_id = ac.acometida_id
              AND DATE(l.fecha_lectura) >= $1
        )
    `;

    // Novelty distribution
    const queryDist = `
      SELECT novedad, COUNT(*) AS count
      FROM lectura
      WHERE DATE(fecha_lectura) >= $1
      GROUP BY novedad
      ORDER BY count DESC
    `;

    const [totalRes, noveltyRes, pendingRes, distRes] = await Promise.all([
      this.postgresqlService.query<any>(queryTotal, [date]),
      this.postgresqlService.query<any>(queryNovelty, [date]),
      this.postgresqlService.query<any>(queryPending, [date]),
      this.postgresqlService.query<any>(queryDist, [date]),
    ]);

    const totalReadingsToday = parseInt(totalRes[0].count);
    const readingsWithNoveltyToday = parseInt(noveltyRes[0].count);
    const pendingReadingsToday = parseInt(pendingRes[0].count);

    const efficiencyPercentage =
      totalReadingsToday > 0
        ? ((totalReadingsToday - readingsWithNoveltyToday) /
            totalReadingsToday) *
          100
        : 0;

    return {
      totalReadingsToday,
      pendingReadingsToday,
      readingsWithNoveltyToday,
      efficiencyPercentage: parseFloat(efficiencyPercentage.toFixed(2)),
      noveltyDistribution: distRes.map((r) => ({
        novelty: r.novedad,
        count: parseInt(r.count),
      })),
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // GLOBAL STATS for a given month
  // ─────────────────────────────────────────────────────────────────────────────
  async findGlobalStats(month: string): Promise<GlobalStatsReportModel> {
    const query = `
      SELECT
        -- Reading-level aggregates for the queried month
        COUNT(*)                                                              AS "totalReadings",
        COUNT(DISTINCT DATE_TRUNC('day', fecha_lectura))                     AS "readingsWithData",
        (COUNT(*)::NUMERIC
          / NULLIF(COUNT(DISTINCT DATE_TRUNC('day', fecha_lectura)), 0))     AS "averageReadingsPerDay",
        AVG(valor_lectura)                                                   AS "averageReadingValue",
        SUM(valor_lectura)                                                   AS "totalReadingValue",
        MIN(valor_lectura)                                                   AS "minReadingValue",
        MAX(valor_lectura)                                                   AS "maxReadingValue",
        AVG(tasa_alcantarillado)                                             AS "averageSewerRate",
        SUM(tasa_alcantarillado)                                             AS "totalSewerRate",
        AVG(lectura_actual - lectura_anterior)                               AS "averageConsumption",
        SUM(lectura_actual - lectura_anterior)                               AS "totalConsumption",
        COUNT(DISTINCT sector)                                               AS "uniqueSectors",
        COUNT(DISTINCT acometida_id)                                         AS "uniqueConnections",
        COUNT(DISTINCT clave_catastral)                                      AS "uniqueCadastralKeys",
        COUNT(valor_lectura)                                                 AS "countNonNullReadingValue",
        COUNT(tasa_alcantarillado)                                           AS "countNonNullSewerRate",

        -- Total active/readable connections in the system (current snapshot)
        -- Uses cat_estados_acometida.permite_lectura to match the domain rule
        (
          SELECT COUNT(a.acometida_id)
          FROM acometida a
          JOIN cat_estados_acometida e ON a.estado_id = e.id_estado
          WHERE e.permite_lectura = TRUE
        )                                                                    AS "totalConnections"

      FROM lectura
      WHERE mes_lectura = $1
        AND fecha_lectura >= date_trunc('month', ($1::text || '-01')::date)
        AND fecha_lectura  < date_trunc('month', ($1::text || '-01')::date) + interval '1 month';
    `;

    const result = await this.postgresqlService.query<GlobalStatsReportModel>(
      query,
      [month],
    );

    const row = result[0];
    return {
      totalReadings: Number(row.totalReadings),
      readingsWithData: Number(row.readingsWithData),
      averageReadingsPerDay: Number(row.averageReadingsPerDay),
      averageReadingValue: Number(row.averageReadingValue),
      totalReadingValue: Number(row.totalReadingValue),
      minReadingValue: Number(row.minReadingValue),
      maxReadingValue: Number(row.maxReadingValue),
      averageSewerRate: Number(row.averageSewerRate),
      totalSewerRate: Number(row.totalSewerRate),
      averageConsumption: Number(row.averageConsumption),
      totalConsumption: Number(row.totalConsumption),
      uniqueSectors: Number(row.uniqueSectors),
      uniqueConnections: Number(row.uniqueConnections),
      uniqueCadastralKeys: Number(row.uniqueCadastralKeys),
      countNonNullReadingValue: Number(row.countNonNullReadingValue),
      countNonNullSewerRate: Number(row.countNonNullSewerRate),
      totalConnections: Number(row.totalConnections),
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // DAILY STATS grouped by day within a month
  // ─────────────────────────────────────────────────────────────────────────────
  async findDailyStats(month: string): Promise<DailyStatsReportModel[]> {
    const query = `
      SELECT
        DATE_TRUNC('day', fecha_lectura)::DATE  AS "date",
        COUNT(*)                                AS "readingsCount",
        SUM(valor_lectura)                      AS "totalReadingValue",
        AVG(valor_lectura)                      AS "averageReadingValue",
        MIN(valor_lectura)                      AS "minReadingValue",
        MAX(valor_lectura)                      AS "maxReadingValue",
        AVG(tasa_alcantarillado)                AS "averageSewerRate",
        AVG(lectura_actual - lectura_anterior)  AS "averageConsumption",
        COUNT(DISTINCT sector)                  AS "uniqueSectors",
        COUNT(DISTINCT acometida_id)            AS "uniqueConnections"
      FROM lectura
      WHERE mes_lectura = $1
        AND fecha_lectura >= date_trunc('month', ($1::text || '-01')::date)
        AND fecha_lectura  < date_trunc('month', ($1::text || '-01')::date) + interval '1 month'
      GROUP BY DATE_TRUNC('day', fecha_lectura)
      ORDER BY "date";
    `;

    const result = await this.postgresqlService.query<any>(query, [month]);
    return result.map((row) => ({
      date: row.date,
      readingsCount: Number(row.readingsCount),
      totalReadingValue: Number(row.totalReadingValue),
      averageReadingValue: Number(row.averageReadingValue),
      minReadingValue: Number(row.minReadingValue),
      maxReadingValue: Number(row.maxReadingValue),
      averageSewerRate: Number(row.averageSewerRate) || 0,
      averageConsumption: Number(row.averageConsumption),
      uniqueSectors: Number(row.uniqueSectors),
      uniqueConnections: Number(row.uniqueConnections),
    }));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SECTOR STATS for a given month
  // ─────────────────────────────────────────────────────────────────────────────
  async findSectorStats(month: string): Promise<SectorStatsReportModel[]> {
    const query = `
      SELECT
        l.sector,
        COUNT(*)                                              AS "readingsCount",
        SUM(l.valor_lectura)                                  AS "totalReadingValue",
        AVG(l.valor_lectura)                                  AS "averageReadingValue",
        AVG(l.tasa_alcantarillado)                            AS "averageSewerRate",
        AVG(l.lectura_actual - l.lectura_anterior)            AS "averageConsumption",
        COUNT(DISTINCT DATE_TRUNC('day', l.fecha_lectura))    AS "activeDays",
        -- Expected connections for this sector this month (from audit table if available)
        COALESCE(aud.total_esperado, 0)                       AS "expectedConnections",
        COALESCE(aud.avance_porcentaje, 0)                    AS "auditProgress"
      FROM lectura l
      LEFT JOIN auditoria_lectura_sector aud
             ON aud.sector_id = l.sector
            AND aud.mes_lectura = $1
      WHERE l.mes_lectura = $1
        AND l.fecha_lectura >= date_trunc('month', ($1::text || '-01')::date)
        AND l.fecha_lectura  < date_trunc('month', ($1::text || '-01')::date) + interval '1 month'
      GROUP BY l.sector, aud.total_esperado, aud.avance_porcentaje
      ORDER BY "readingsCount" DESC;
    `;

    const result = await this.postgresqlService.query<any>(query, [month]);
    return result.map((row) => ({
      sector: Number(row.sector),
      readingsCount: Number(row.readingsCount),
      totalReadingValue: Number(row.totalReadingValue),
      averageReadingValue: Number(row.averageReadingValue),
      averageSewerRate: Number(row.averageSewerRate),
      averageConsumption: Number(row.averageConsumption),
      activeDays: Number(row.activeDays),
      expectedConnections: Number(row.expectedConnections) || 0,
      auditProgress: Number(row.auditProgress) || 0,
    }));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // NOVELTY STATS for a given month
  // ─────────────────────────────────────────────────────────────────────────────
  async findNoveltyStats(month: string): Promise<NoveltyStatsReportModel[]> {
    const query = `
      SELECT
        novedad                                              AS "novelty",
        COUNT(*)                                             AS "count",
        AVG(valor_lectura)                                   AS "averageReadingValue",
        AVG(lectura_actual - lectura_anterior)               AS "averageConsumption",
        SUM(valor_lectura)                                   AS "totalReadingValue"
      FROM lectura
      WHERE mes_lectura = $1
        AND fecha_lectura >= date_trunc('month', ($1::text || '-01')::date)
        AND fecha_lectura  < date_trunc('month', ($1::text || '-01')::date) + interval '1 month'
      GROUP BY novedad
      ORDER BY "count" DESC;
    `;

    const result = await this.postgresqlService.query<any>(query, [month]);
    return result.map((row) => ({
      novelty: row.novelty,
      count: Number(row.count),
      averageReadingValue: Number(row.averageReadingValue),
      averageConsumption: Number(row.averageConsumption),
      totalReadingValue: Number(row.totalReadingValue),
    }));
  }
  // ═══════════════════════════════════════════════════════════════════════════
  // AUDIT LECTURAS POR SECTOR
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Llama al procedimiento almacenado que genera las metas de auditoría
   * para todos los sectores del mes dado, usando acometidas con permite_lectura = TRUE.
   */
  async initializeMonthlyAudit(month: string): Promise<InitializeAuditModel> {
    try {
      await this.postgresqlService.query(
        `CALL pr_generar_auditoria_mensual($1::char)`,
        [month],
      );

      const summary = await this.postgresqlService.query<{
        sectors_generated: string;
      }>(
        `SELECT COUNT(*) AS sectors_generated
         FROM auditoria_lectura_sector
         WHERE mes_lectura = $1`,
        [month],
      );

      return ReadingAuditMapper.fromInitializeAuditSqlResultToModel({
        message: `Auditoría inicializada correctamente para el periodo ${month}`,
        period: month,
        sectors_generated: Number(summary[0]?.sectors_generated ?? 0),
      });
    } catch (error) {
      throw new RpcException({
        statusCode: statusCode.INTERNAL_SERVER_ERROR,
        message: `Error al inicializar auditoría para el mes ${month}`,
      });
    }
  }

  /**
   * Retorna el estado de auditoría de todos los sectores para un mes dado.
   * Incluye avance, pendientes y si el sector fue cerrado.
   */
  async getAuditByMonth(month: string): Promise<AuditSectorModel[]> {
    try {
      const query = `
        SELECT
          als.audit_id                    AS audit_idd,
          als.mes_lectura                 AS reading_month,
          als.sector_id                   AS sector_id,
          als.total_esperado              AS expected_total,
          als.total_completadas           AS completed_total,
          als.total_pendientes            AS pending_total,
          als.avance_porcentaje           AS progress_percentage,
          als.completo                    AS is_complete,
          als.fecha_cierre                AS closure_date,
          als.usuario_supervisor_id::text AS supervisor_id,
          als.observaciones               AS observations,
          als.created_at                  AS created_at,
          als.updated_at                  AS updated_at
        FROM public.auditoria_lectura_sector als
        WHERE als.mes_lectura = $1
        ORDER BY als.sector_id;
      `;

      const result = await this.postgresqlService.query<AuditSectorSqlResult>(
        query,
        [month],
      );
      return ReadingAuditMapper.toListOfAuditSectorModels(result);
    } catch (error) {
      throw new RpcException({
        statusCode: statusCode.INTERNAL_SERVER_ERROR,
        message: `Error al obtener auditoría del mes ${month}`,
      });
    }
  }

  /**
   * Retorna el estado de auditoría de un sector específico para un mes.
   * Usado por el supervisor de zona para ver el detalle de su área.
   */
  async getAuditBySectorAndMonth(
    sector: number,
    month: string,
  ): Promise<AuditSectorModel | null> {
    try {
      const query = `
        SELECT
          als.audit_id                    AS audit_idd,
          als.mes_lectura                 AS reading_month,
          als.sector_id                   AS sector_id,
          als.total_esperado              AS expected_total,
          als.total_completadas           AS completed_total,
          als.total_pendientes            AS pending_total,
          als.avance_porcentaje           AS progress_percentage,
          als.completo                    AS is_complete,
          als.fecha_cierre                AS closure_date,
          als.usuario_supervisor_id::text AS supervisor_id,
          als.observaciones               AS observations,
          als.created_at                  AS created_at,
          als.updated_at                  AS updated_at
        FROM public.auditoria_lectura_sector als
        WHERE als.sector_id = $1
          AND als.mes_lectura = $2
        LIMIT 1;
      `;

      const result = await this.postgresqlService.query<AuditSectorSqlResult>(
        query,
        [sector, month],
      );

      return result[0]
        ? ReadingAuditMapper.toAuditSectorModel(result[0])
        : null;
    } catch (error) {
      throw new RpcException({
        statusCode: statusCode.INTERNAL_SERVER_ERROR,
        message: `Error al obtener auditoría del sector ${sector}`,
      });
    }
  }

  /**
   * Cierre supervisado de la auditoría de un sector.
   * Solo un supervisor (usuario_supervisor_id) puede cerrar manualmente.
   * Una vez cerrado con supervisor, el trigger impide reapertura automática.
   */
  async closeAuditSector(
    sector: number,
    month: string,
    supervisorId: string,
    observaciones?: string,
  ): Promise<CloseAuditSectorModel> {
    try {
      const query = `
        UPDATE public.auditoria_lectura_sector
        SET
          completo              = TRUE,
          fecha_cierre          = NOW(),
          usuario_supervisor_id = $3::uuid,
          observaciones         = COALESCE($4, observaciones),
          updated_at            = NOW()
        WHERE sector_id  = $1
          AND mes_lectura = $2
        RETURNING
          audit_id                    AS audit_id,
          sector_id                   AS sector_id,
          mes_lectura                 AS reading_month,
          completo                    AS is_complete,
          fecha_cierre                AS closure_date,
          usuario_supervisor_id::text AS supervisor_id,
          observaciones               AS observations,
          created_at                  AS created_at;
      `;

      const result =
        await this.postgresqlService.query<CloseAuditSectorSqlResult>(query, [
          sector,
          month,
          supervisorId,
          observaciones ?? null,
        ]);

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `No se encontró la auditoría del sector ${sector} para el mes ${month}`,
        });
      }

      return ReadingAuditMapper.fromCloseAuditSectorSqlResultToModel(result[0]);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Histórico de avances de un sector a lo largo de los últimos N meses.
   * Ideal para gráficas de tendencia de eficiencia del lector de zona.
   */
  async getAuditHistoryBySector(
    sector: number,
    months: number = 12,
  ): Promise<AuditSectorHistoryModel[]> {
    try {
      const query = `
        SELECT
          als.mes_lectura       AS reading_month,
          als.sector_id         AS sector_id,
          als.total_esperado    AS expected_total,
          als.total_completadas           AS completed_total,
          als.avance_porcentaje           AS progress_percentage,
          als.completo                    AS is_complete,
          als.fecha_cierre                AS closure_date,
          als.usuario_supervisor_id::text AS supervisor_id,
          als.observaciones               AS observations,
          als.created_at                  AS created_at
        FROM public.auditoria_lectura_sector als
        WHERE als.sector_id = $1
        ORDER BY als.mes_lectura DESC
        LIMIT $2;
      `;

      const result =
        await this.postgresqlService.query<AuditSectorHistorySqlResult>(query, [
          sector,
          months,
        ]);

      return ReadingAuditMapper.toListOfAuditSectorHistoryModels(result);
    } catch (error) {
      throw new RpcException({
        statusCode: statusCode.INTERNAL_SERVER_ERROR,
        message: `Error al obtener histórico de auditoría del sector ${sector}`,
      });
    }
  }
}
