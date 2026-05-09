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
import {
  AdvancedReportReadingsSQLResult,
  MonthlySummarySQLResult,
} from '../../../interfaces/sql/reading-sql.result.interface';
import { ReadingSQLAdapter } from '../../../adapters/reading-sql.adapter';
import { ReadingAuditMapper } from '../../../adapters/reading-sql.audit.adapter';
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
import {
  DatabaseAbstract,
  IDatabaseClient,
} from '../../../../../../shared/connections/database/abstract/abstract.database';

@Injectable()
export class ReadingReportPostgreSQLPersistence
  implements InterfaceReadingReportRepository
{
  constructor(private readonly databaseService: DatabaseAbstract) {}

  async findAdvancedReportReadings(
    month: string,
  ): Promise<AdvancedReportReadingsModel[]> {
    const query = `
      WITH readable_connections AS (
        SELECT
          ac.sector,
          COUNT(*) AS total_readable_units,
          SUM(CASE WHEN ac.estado_id = 1 THEN 1 ELSE 0 END) AS pure_active_units,
          SUM(CASE WHEN ac.estado_id <> 1 THEN 1 ELSE 0 END) AS special_status_with_reading
        FROM acometida ac
        JOIN cat_estados_acometida est ON ac.estado_id = est.id_estado
        WHERE est.permite_lectura = TRUE
        GROUP BY ac.sector
      ),
      sector_readings AS (
        SELECT
          sector,
          COUNT(DISTINCT acometida_id) AS readings_completed
        FROM lectura
        WHERE mes_lectura = $1
        GROUP BY sector
      )
      SELECT
        rc.sector,
        rc.total_readable_units AS total_connections,
        COALESCE(sr.readings_completed, 0) AS readings_completed,
        rc.total_readable_units - COALESCE(sr.readings_completed, 0) AS missing_readings,
        CASE
          WHEN rc.total_readable_units = 0 THEN 0
          ELSE ROUND(COALESCE(sr.readings_completed, 0) * 100.0 / rc.total_readable_units, 1)
        END AS progress_percentage,
        rc.pure_active_units,
        rc.special_status_with_reading AS suspended_or_arrears_with_reading,
        (COALESCE(sr.readings_completed, 0) - rc.total_readable_units) AS data_discrepancy,
        CASE
          WHEN rc.total_readable_units = 0 THEN 0
          ELSE ROUND(COALESCE(sr.readings_completed, 0) * 100.0 / rc.total_readable_units, 1)
        END AS total_visit_efficiency,
        COALESCE(aud.total_esperado, 0) AS audit_total_esperado,
        COALESCE(aud.total_completadas, 0) AS audit_total_completadas,
        COALESCE(aud.avance_porcentaje, 0) AS audit_avance_porcentaje,
        COALESCE(aud.completo, FALSE) AS audit_completo
      FROM readable_connections rc
      LEFT JOIN sector_readings sr ON sr.sector = rc.sector
      LEFT JOIN auditoria_lectura_sector aud ON aud.sector_id = rc.sector AND aud.mes_lectura = $1
      ORDER BY rc.sector;
    `;

    const result =
      await this.databaseService.query<AdvancedReportReadingsSQLResult>(query, [
        month,
      ]);
    if (result.length === 0) throw new Error('No se encontraron lecturas');
    return result.map(
      ReadingSQLAdapter.fromReadingPostgreSQLResultToAdvancedReportReadingsModel,
    );
  }

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
    const result = await this.databaseService.query<any>(query, [
      cadastralKey,
      limit,
    ]);
    return result.map((row) => ({
      ...row,
      readingDate: new Date(row.readingDate),
    }));
  }

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
    return this.databaseService.query<DailyReadingsReportModel>(query, [
      startOfDay,
      endOfDay,
    ]);
  }

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
    const result = await this.databaseService.query<MonthlySummarySQLResult>(
      query,
      [year],
    );
    const monthlySummaries = result.map(
      ReadingSQLAdapter.fromMonthlySummarySQLResultToMonthlySummaryModel,
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

  async findDashboardMetrics(date: string): Promise<DashboardMetricsModel> {
    const dashboardQuery = `
      WITH date_filter AS (
        -- Materialize once; all aggregates below reuse this filtered set
        SELECT acometida_id, novedad
        FROM lectura
        WHERE fecha_lectura >= $1::date
      ),
      totals AS (
        SELECT
          COUNT(*)                                                            AS total_count,
          COUNT(*) FILTER (WHERE novedad NOT IN ('NORMAL', 'LECTURA NORMAL')) AS novelty_count
        FROM date_filter
      ),
      dist AS (
        SELECT novedad, COUNT(*) AS cnt
        FROM date_filter
        GROUP BY novedad
        ORDER BY cnt DESC
      ),
      pending AS (
        -- Readable connections with no reading from $1 onwards
        SELECT COUNT(*) AS pending_count
        FROM acometida ac
        JOIN cat_estados_acometida est ON ac.estado_id = est.id_estado
        WHERE est.permite_lectura = TRUE
          AND NOT EXISTS (
            SELECT 1 FROM date_filter df
            WHERE df.acometida_id = ac.acometida_id
          )
      )
      SELECT
        (SELECT total_count   FROM totals)   AS total_count,
        (SELECT novelty_count FROM totals)   AS novelty_count,
        (SELECT pending_count FROM pending)  AS pending_count,
        (SELECT json_agg(json_build_object('novedad', novedad, 'count', cnt) ORDER BY cnt DESC)
         FROM dist)                          AS dist_json;
    `;
    const [dashRes] = await this.databaseService.query<any>(dashboardQuery, [
      date,
    ]);

    const totalReadingsToday = parseInt(dashRes.total_count);
    const readingsWithNoveltyToday = parseInt(dashRes.novelty_count);
    const pendingReadingsToday = parseInt(dashRes.pending_count);
    const distRes = dashRes.dist_json ?? [];

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
        count: parseInt(String(r.count)),
      })),
    };
  }

  async findGlobalStats(month: string): Promise<GlobalStatsReportModel> {
    const query = `
      WITH total_conn AS (
        SELECT COUNT(a.acometida_id) AS cnt
        FROM acometida a
        JOIN cat_estados_acometida e ON a.estado_id = e.id_estado
        WHERE e.permite_lectura = TRUE
      )
      SELECT
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
        (SELECT cnt FROM total_conn)                                         AS "totalConnections"
      FROM lectura
      WHERE mes_lectura = $1;
    `;
    const result = await this.databaseService.query<GlobalStatsReportModel>(
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
      GROUP BY DATE_TRUNC('day', fecha_lectura)
      ORDER BY "date";
    `;
    const result = await this.databaseService.query<any>(query, [month]);
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
        COALESCE(MAX(aud.total_esperado),    0)               AS "expectedConnections",
        COALESCE(MAX(aud.avance_porcentaje), 0)               AS "auditProgress"
      FROM lectura l
      LEFT JOIN auditoria_lectura_sector aud
            ON aud.sector_id  = l.sector
            AND aud.mes_lectura = $1
      WHERE l.mes_lectura = $1
      GROUP BY l.sector
      ORDER BY "readingsCount" DESC;
    `;
    const result = await this.databaseService.query<any>(query, [month]);
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
      GROUP BY novedad
      ORDER BY "count" DESC;
    `;
    const result = await this.databaseService.query<any>(query, [month]);
    return result.map((row) => ({
      novelty: row.novelty,
      count: Number(row.count),
      averageReadingValue: Number(row.averageReadingValue),
      averageConsumption: Number(row.averageConsumption),
      totalReadingValue: Number(row.totalReadingValue),
    }));
  }

  async initializeMonthlyAudit(month: string): Promise<InitializeAuditModel> {
    try {
      await this.databaseService.query(
        `CALL pr_generar_auditoria_mensual($1::char)`,
        [month],
      );
      const summary = await this.databaseService.query<{
        sectors_generated: string;
      }>(
        `SELECT COUNT(*) AS sectors_generated FROM auditoria_lectura_sector WHERE mes_lectura = $1`,
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

  async getAuditByMonth(month: string): Promise<AuditSectorModel[]> {
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
    const result = await this.databaseService.query<AuditSectorSqlResult>(
      query,
      [month],
    );
    return ReadingAuditMapper.toListOfAuditSectorModels(result);
  }

  async getAuditBySectorAndMonth(
    sector: number,
    month: string,
  ): Promise<AuditSectorModel | null> {
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
    const result = await this.databaseService.query<AuditSectorSqlResult>(
      query,
      [sector, month],
    );
    return result[0] ? ReadingAuditMapper.toAuditSectorModel(result[0]) : null;
  }

  async closeAuditSector(
    sector: number,
    month: string,
    supervisorId: string,
    observaciones?: string,
  ): Promise<CloseAuditSectorModel> {
    return this.databaseService.transaction(async (client: IDatabaseClient) => {
      const updateQuery = `
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
      const rows = await client.query<CloseAuditSectorSqlResult>(updateQuery, [
        sector,
        month,
        supervisorId,
        observaciones ?? null,
      ]);
      if (rows.length === 0)
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `No se encontró la auditoría del sector ${sector}`,
        });
      return ReadingAuditMapper.fromCloseAuditSectorSqlResultToModel(rows[0]);
    });
  }

  async getAuditHistoryBySector(
    sector: number,
    months: number = 12,
  ): Promise<AuditSectorHistoryModel[]> {
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
      await this.databaseService.query<AuditSectorHistorySqlResult>(query, [
        sector,
        months,
      ]);
    return ReadingAuditMapper.toListOfAuditSectorHistoryModels(result);
  }
}
