import { Injectable, Inject } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { UUID } from 'crypto';
import { InterfaceIncidentRepository } from '../../../../domain/contracts/incident.interface.repository';
import { IncidentModel } from '../../../../domain/schemas/model/incident.model';
import { IncidentCategoryModel } from '../../../../domain/schemas/model/incident-category-type.model';
import {
  DatabaseAbstract,
  IDatabaseClient,
} from '../../../../../../shared/connections/database/abstract/abstract.database';
import {
  IncidentCategorySQLResult,
  IncidentSQLResult,
} from '../../../interfaces/sql/incident-sql.result.interface';
import { IncidentSQLAdapter } from '../../../adapters/incident-sql.adapter';
import { IncidentDetailRowResponse } from '../../../../domain/schemas/response/view_incident.response';
import { IncidentAdapter } from '../../../adapters/incident.adapter';
import { IncidentDetailRowSQLResult } from '../../../interfaces/sql/view_incidents.sql-result';
import { IncidentDashboardResponseDto } from '../../../../application/dtos/response/incident-dashboard.dto';
import { IncidentDashboardMapper } from '../../../../application/mappers/incident-dashboard.mapper';
import { IncidentChangeDetail } from '../../../../application/dtos/request/resolve-incident.request';
import { IMeterHistoryRecorder } from '../../../services/meter-history-recorder.interface';

@Injectable()
export class IncidentPersistencePostgreSQL implements InterfaceIncidentRepository {
  constructor(
    private readonly databaseService: DatabaseAbstract,
    @Inject('MeterHistoryRecorder')
    private readonly meterHistoryRecorder: IMeterHistoryRecorder,
  ) {}

  async getIncidentDashboardKpis(): Promise<IncidentDashboardResponseDto | null> {
    try {
      const query = `
        SELECT jsonb_build_object(
            
            -- 1. KPIs GLOBALES (Tarjetas Superiores)
            'kpis_generales', (
                SELECT jsonb_build_object(
                    'total_incidentes', COUNT(*),
                    'total_pendientes', COUNT(*) FILTER (WHERE status NOT IN ('RESUELTO', 'FALSO_REPORTE')),
                    'total_resueltos', COUNT(*) FILTER (WHERE status = 'RESUELTO'),
                    'total_criticos_activos', COUNT(*) FILTER (WHERE current_priority = 'CRITICA' AND status NOT IN ('RESUELTO', 'FALSO_REPORTE')),
                    'costo_reparacion_acumulado', COALESCE(SUM(repair_cost), 0.00),
                    'tiempo_promedio_resolucion_dias', ROUND(AVG(open_days) FILTER (WHERE status = 'RESUELTO'), 1)
                )
                FROM public.view_incidentes_detalle
            ),

            -- 2. DISTRIBUCIÓN POR ESTADO (Para Gráfico de Dona / Pastel)
            'por_estado', (
                SELECT jsonb_agg(jsonb_build_object('estado', status, 'cantidad', count))
                FROM (
                    SELECT status, COUNT(*) as count 
                    FROM public.view_incidentes_detalle 
                    GROUP BY status
                    ORDER BY count DESC
                ) t
            ),

            -- 3. DISTRIBUCIÓN POR CATEGORÍA Y TIPO (Para Gráfico de Barras / Treemap)
            'por_categoria', (
                SELECT jsonb_agg(jsonb_build_object(
                    'categoria', category_name,
                    'cantidad', count,
                    'costo_total', total_cost
                ))
                FROM (
                    SELECT category_name, COUNT(*) as count, SUM(repair_cost) as total_cost
                    FROM public.view_incidentes_detalle
                    GROUP BY category_name
                    ORDER BY count DESC
                ) t
            ),

            -- 4. INCIDENTES POR ORIGEN (Para ver adopción de canales web vs físicos)
            'por_origen_reporte', (
                SELECT jsonb_agg(jsonb_build_object('origen', report_origin, 'cantidad', count))
                FROM (
                    SELECT report_origin, COUNT(*) as count 
                    FROM public.view_incidentes_detalle 
                    GROUP BY report_origin
                    ORDER BY count DESC
                ) t
            ),

            -- 5. INCIDENTES POR PRIORIDAD (Gráfico de Columnas o Embudo)
            'por_prioridad', (
                SELECT jsonb_agg(jsonb_build_object('prioridad', current_priority, 'cantidad', count))
                FROM (
                    SELECT current_priority, COUNT(*) as count 
                    FROM public.view_incidentes_detalle 
                    GROUP BY current_priority
                    ORDER BY 
                        CASE current_priority 
                            WHEN 'CRITICA' THEN 1 
                            WHEN 'ALTA' THEN 2 
                            WHEN 'MEDIA' THEN 3 
                            WHEN 'BAJA' THEN 4 
                            ELSE 5 
                        END
                ) t
            ),

            -- 6. TENDENCIA DE REPORTES (Últimos 30 días - Para Gráfico de Líneas/Área)
            'tendencia_ultimos_30_dias', (
                SELECT jsonb_agg(jsonb_build_object(
                    'fecha', fecha::date,
                    'cantidad_reportada', cantidad
                ))
                FROM (
                    SELECT DATE_TRUNC('day', report_date) AS fecha, COUNT(*) AS cantidad
                    FROM public.view_incidentes_detalle
                    WHERE report_date >= CURRENT_DATE - INTERVAL '30 days'
                    GROUP BY DATE_TRUNC('day', report_date)
                    ORDER BY fecha ASC
                ) t
            ),

            -- 7. TOP 10 INCIDENTES CRÍTICOS SIN RESOLVER (Para Tabla de Acción Inmediata)
            'atencion_inmediata', (
                SELECT COALESCE(jsonb_agg(jsonb_build_object(
                    'incident_code', incident_code,
                    'connection_id', connection_id,
                    'category', category_name,
                    'type', incident_type_name,
                    'days_open', pending_days,
                    'latitude', latitude,
                    'longitude', longitude
                )), '[]'::jsonb)
                FROM (
                    SELECT incident_code, connection_id, category_name, incident_type_name, pending_days, latitude, longitude
                    FROM public.view_incidentes_detalle
                    WHERE current_priority = 'CRITICA' AND status NOT IN ('RESUELTO', 'FALSO_REPORTE')
                    ORDER BY pending_days DESC NULLS LAST
                    LIMIT 10
                ) t
            )

        ) AS "dashboard_data";
      `;
      const result = await this.databaseService.query<Record<string, unknown>>(
        query,
        [],
      );

      if (!result || result.length === 0 || !result[0]?.dashboard_data) {
        return null;
      }
      return IncidentDashboardMapper.toDto(
        result[0].dashboard_data as Record<string, unknown>,
      );
    } catch (error) {
      throw error;
    }
  }

  async createIncident(
    incident: IncidentModel,
    images: string[],
  ): Promise<IncidentModel | null> {
    try {
      return await this.databaseService.transaction(
        async (client: IDatabaseClient) => {
          // 1. Insert incident
          const insertQuery = /* sql */ `
          INSERT INTO public.incidente_medidor (
            acometida_id, lectura_id, tipo_incidente_id, descripcion_reporte,
            direccion_referencia, origen_reporte, prioridad, usuario_reporta_id,
            cliente_usuario_reporta_id, coordenadas, datos_reportante,
            condicion_medidor, estado_fisico, requiere_accion_inmediata
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9,
            CASE WHEN $10::double precision IS NOT NULL AND $11::double precision IS NOT NULL
                 THEN ST_SetSRID(ST_MakePoint($11, $10), 4326) ELSE NULL END,
            $12, $13, $14, $15
          )
          RETURNING
            incidente_id AS incident_id,
            acometida_id,
            codigo_incidente,
            lectura_id,
            tipo_incidente_id,
            descripcion_reporte,
            direccion_referencia,
            estado,
            origen_reporte,
            prioridad,
            fecha_reporte,
            usuario_reporta_id,
            cliente_usuario_reporta_id,
            ST_X(coordenadas) as longitude,
            ST_Y(coordenadas) as latitude,
            fecha_resolucion,
            usuario_resuelve_id,
            descripcion_resolucion,
            cobrar_a_usuario,
            costo_reparacion,
            datos_reportante AS "reportClient";
        `;

          const lat = incident.coordinates?.lat ?? null;
          const lng = incident.coordinates?.lng ?? null;

          const result = await client.query<IncidentSQLResult>(insertQuery, [
            incident.connectionId,
            incident.readingId,
            incident.incidentTypeId,
            incident.reportDescription,
            incident.referenceAddress,
            incident.reportOrigin,
            incident.priority,
            incident.reporterUserId,
            incident.clienteUsuarioReportaId,
            lat,
            lng,
            incident.reportClient
              ? JSON.stringify(incident.reportClient)
              : null,
            incident.meterCondition ?? null,
            incident.meterPhysicalState ?? null,
            incident.requiresImmediateAction ?? false,
          ]);

          if (result.length === 0) return null;
          const createdIncident = result[0];

          // 2. Insert photos
          if (images.length > 0) {
            const insertPhotoQuery = /* sql */ `
            INSERT INTO public.foto_incidente (incidente_id, ruta_archivo, tipo_foto)
            VALUES ($1, $2, 'REPORTE');
          `;
            for (const url of images) {
              await client.query(insertPhotoQuery, [
                createdIncident.incident_id,
                url,
              ]);
            }
          }

          return IncidentSQLAdapter.fromSQLResultToModel(createdIncident);
        },
      );
    } catch (error) {
      const err = error as Error;
      throw new RpcException({
        statusCode: 500,
        message: `Error al crear el incidente en PostgreSQL: ${err}`,
      });
    }
  }

  async resolveIncident(
    incidentId: string,
    resolverUserId: UUID,
    description: string,
    repairCost: number,
    chargeToUser: boolean,
    images: string[],
    changeDetails?: IncidentChangeDetail[] | null,
  ): Promise<IncidentModel | null> {
    try {
      return await this.databaseService.transaction(
        async (client: IDatabaseClient) => {
          // 1. Update incident state
          const updateQuery = /* sql */ `
          UPDATE public.incidente_medidor
          SET
            estado = 'RESUELTO',
            fecha_resolucion = NOW(),
            usuario_resuelve_id = $1,
            descripcion_resolucion = $2,
            costo_reparacion = $3,
            cobrar_a_usuario = $4,
            detalles_cambio = $5,
            updated_at = NOW()
          WHERE incidente_id = $6
          RETURNING
            incidente_id AS incident_id, acometida_id, lectura_id, tipo_incidente_id, descripcion_reporte,
            direccion_referencia, estado, origen_reporte, prioridad, fecha_reporte, usuario_reporta_id,
            cliente_usuario_reporta_id, ST_X(coordenadas) as longitude, ST_Y(coordenadas) as latitude,
            fecha_resolucion, usuario_resuelve_id, descripcion_resolucion, cobrar_a_usuario, costo_reparacion;
        `;

          // Solo se guarda si el usuario realmente envió detalles de cambio; caso contrario queda null
          const changeDetailsJson =
            changeDetails && changeDetails.length > 0
              ? JSON.stringify(changeDetails)
              : null;

          const result = await client.query<IncidentSQLResult>(updateQuery, [
            resolverUserId,
            description,
            repairCost,
            chargeToUser,
            changeDetailsJson,
            incidentId,
          ]);

          if (result.length === 0) return null;
          const resolvedIncident = result[0];

          // 2. Insert resolution photos
          if (images.length > 0) {
            const insertPhotoQuery = /* sql */ `
            INSERT INTO public.foto_incidente (incidente_id, ruta_archivo, tipo_foto)
            VALUES ($1, $2, 'RESOLUCION');
          `;
            for (const url of images) {
              await client.query(insertPhotoQuery, [incidentId, url]);
            }
          }

          // 3. Registrar en historial_medidores cada reemplazo físico de medidor reportado
          if (resolvedIncident.acometida_id && changeDetails?.length) {
            for (const changeDetail of changeDetails) {
              await this.meterHistoryRecorder.recordMeterReplacement(client, {
                connectionId: resolvedIncident.acometida_id,
                changeDetail,
              });
            }
          }

          return IncidentSQLAdapter.fromSQLResultToModel(resolvedIncident);
        },
      );
    } catch (error) {
      const err = error as Error;
      throw new RpcException({
        statusCode: 500,
        message: `Error al resolver el incidente en PostgreSQL: ${err.message}`,
      });
    }
  }

  async findIncidentsByConnection(
    connectionId: string,
  ): Promise<IncidentDetailRowResponse[]> {
    const query = /* sql */ `
      SELECT
          a.*,
          b.estado_anterior AS previous_order_state,
          b.estado_nuevo AS current_order_state
      FROM public.view_incidentes_detalle a
      LEFT JOIN work_orders.orden_trabajo c
          ON c.id_entidad_origen = a.incident_id
      LEFT JOIN LATERAL (
          SELECT estado_anterior, estado_nuevo
          FROM work_orders.historial_estado_orden_trabajo
          WHERE id_orden_trabajo = c.id_orden_trabajo
          ORDER BY id_historial DESC, fecha_cambio DESC
          LIMIT 1
      ) b ON true
      WHERE a.connection_id = $1
      ORDER BY a.report_date DESC;
    `;
    const result = await this.databaseService.query<IncidentDetailRowSQLResult>(
      query,
      [connectionId],
    );
    return IncidentAdapter.fromSQLResultListToResponseList(result);
  }

  async findById(
    incidentId: string,
  ): Promise<IncidentDetailRowResponse | null> {
    const query = /* sql */ `
      SELECT
          a.*,
          b.estado_anterior AS previous_order_state,
          b.estado_nuevo AS current_order_state
      FROM public.view_incidentes_detalle a
      LEFT JOIN work_orders.orden_trabajo c
          ON c.id_entidad_origen = a.incident_id
      LEFT JOIN LATERAL (
          SELECT estado_anterior, estado_nuevo
          FROM work_orders.historial_estado_orden_trabajo
          WHERE id_orden_trabajo = c.id_orden_trabajo
          ORDER BY id_historial DESC, fecha_cambio DESC
          LIMIT 1
      ) b ON true
      WHERE a.incident_id = $1::uuid
      ORDER BY a.report_date DESC;
    `;
    const result = await this.databaseService.query<IncidentDetailRowSQLResult>(
      query,
      [incidentId],
    );
    if (result.length === 0) return null;
    return IncidentAdapter.fromSQLResultToResponse(result[0]);
  }

  async findIncidents(filters: {
    connectionId?: string | null;
    status?: string | null;
    priority?: string | null;
    categoryId?: number | null;
    sector?: string | null;
    reference?: string | null;
    reportDate?: Date | null;
    internalUserId?: string | null;
    externalUserId?: string | null;
    categoryCode?: string | null;
  }): Promise<IncidentDetailRowResponse[]> {
    let query = /* sql */ `
      SELECT
          a.*,
          b.estado_anterior AS previous_order_state,
          b.estado_nuevo AS current_order_state
      FROM public.view_incidentes_detalle a
      INNER JOIN public.incidente_medidor im
          ON im.codigo_incidente = a.incident_code
      LEFT JOIN work_orders.orden_trabajo c
          ON c.id_entidad_origen = a.incident_id
      LEFT JOIN LATERAL (
          SELECT estado_anterior, estado_nuevo
          FROM work_orders.historial_estado_orden_trabajo
          WHERE id_orden_trabajo = c.id_orden_trabajo
          ORDER BY id_historial DESC, fecha_cambio DESC
          LIMIT 1
      ) b ON true
      WHERE 1=1
    `;

    const values: any[] = [];
    let paramIndex = 1;

    if (filters.connectionId) {
      query += /* sql */ ` AND a.connection_id = $${paramIndex}`;
      values.push(filters.connectionId);
      paramIndex++;
    }

    if (filters.status) {
      query += /* sql */ ` AND a.status = $${paramIndex}`;
      values.push(filters.status);
      paramIndex++;
    }

    if (filters.priority) {
      query += /* sql */ ` AND a.current_priority = $${paramIndex}`;
      values.push(filters.priority);
      paramIndex++;
    }

    if (filters.categoryId) {
      query += /* sql */ ` AND a.category_id = $${paramIndex}`;
      values.push(filters.categoryId);
      paramIndex++;
    }

    if (filters.internalUserId) {
      query += /* sql */ ` AND im.usuario_reporta_id = $${paramIndex}`;
      values.push(filters.internalUserId);
      paramIndex++;
    }

    if (filters.externalUserId) {
      query += /* sql */ ` AND im.cliente_usuario_reporta_id = $${paramIndex}`;
      values.push(filters.externalUserId);
      paramIndex++;
    }

    if (filters.externalUserId && filters.connectionId) {
      query += /* sql */ ` AND (im.cliente_usuario_reporta_id = $${paramIndex} OR a.connection_id = $${paramIndex + 1})`;
      values.push(filters.externalUserId, filters.connectionId);
      paramIndex += 2;
    }

    if (filters.sector) {
      query += /* sql */ ` AND CAST(split_part(a.connection_id, '-', 1) AS INTEGER) = $${paramIndex}`;
      values.push(filters.sector);
      paramIndex++;
    }

    if (filters.reference) {
      query += /* sql */ ` AND a.reference_address ILIKE $${paramIndex}`;
      values.push(`%${filters.reference}%`);
      paramIndex++;
    }

    if (filters.reportDate) {
      query += /* sql */ ` AND a.report_date::date = $${paramIndex}`;
      values.push(filters.reportDate);
      paramIndex++;
    }

    if (filters.categoryCode) {
      query += /* sql */ ` AND a.category_code = $${paramIndex}`;
      values.push(filters.categoryCode);
      paramIndex++;
    }

    query += /* sql */ ` ORDER BY a.report_date DESC;`;

    const result = await this.databaseService.query<IncidentDetailRowSQLResult>(
      query,
      values,
    );
    return IncidentAdapter.fromSQLResultListToResponseList(result);
  }

  async findIncidentsByClientUserId(filters: {
    externalUserId: string;
    connectionId?: string | null;
    status?: string | null;
    priority?: string | null;
    categoryId?: number | null;
    sector?: string | null;
    reference?: string | null;
    reportDate?: Date | null;
  }): Promise<IncidentDetailRowResponse[]> {
    try {
      let query = /* sql */ `
      SELECT
          a.*,
          b.estado_anterior AS previous_order_state,
          b.estado_nuevo AS current_order_state
      FROM public.view_incidentes_detalle a
      INNER JOIN public.incidente_medidor im
          ON im.codigo_incidente = a.incident_code
      LEFT JOIN work_orders.orden_trabajo c
          ON c.id_entidad_origen = a.incident_id
      LEFT JOIN LATERAL (
          SELECT estado_anterior, estado_nuevo
          FROM work_orders.historial_estado_orden_trabajo
          WHERE id_orden_trabajo = c.id_orden_trabajo
          ORDER BY id_historial DESC, fecha_cambio DESC
          LIMIT 1
      ) b ON true
      WHERE im.cliente_usuario_reporta_id = $1
        OR im.acometida_id in (
          select a.acometida_id from acometida ac
          inner join cliente_usuario cu on cu.cliente_id = ac.cliente_id
          where cu.cliente_usuario_id = $1
        )
    `;

      const values: any[] = [filters.externalUserId];
      let paramIndex = 2;

      // Filtros opcionales adicionales sobre los datos de ese cliente
      if (filters.connectionId) {
        query += /* sql */ ` AND a.connection_id = $${paramIndex}`;
        values.push(filters.connectionId);
        paramIndex++;
      }

      if (filters.status) {
        query += /* sql */ ` AND a.status = $${paramIndex}`;
        values.push(filters.status);
        paramIndex++;
      }

      if (filters.priority) {
        query += /* sql */ ` AND a.current_priority = $${paramIndex}`;
        values.push(filters.priority);
        paramIndex++;
      }

      if (filters.categoryId) {
        query += /* sql */ ` AND a.category_id = $${paramIndex}`;
        values.push(filters.categoryId);
        paramIndex++;
      }

      if (filters.sector) {
        query += /* sql */ ` AND split_part(a.connection_id, '-', 1) = $${paramIndex}`;
        values.push(filters.sector.toString());
        paramIndex++;
      }

      if (filters.reference) {
        query += /* sql */ ` AND a.reference_address ILIKE $${paramIndex}`;
        values.push(`%${filters.reference}%`);
        paramIndex++;
      }

      if (filters.reportDate) {
        query += /* sql */ ` AND a.report_date::date = $${paramIndex}`;
        values.push(filters.reportDate);
        paramIndex++;
      }

      query += /* sql */ ` ORDER BY a.report_date DESC;`;

      const result =
        await this.databaseService.query<IncidentDetailRowSQLResult>(
          query,
          values,
        );

      return IncidentAdapter.fromSQLResultListToResponseList(result);
    } catch (error) {
      throw error;
    }
  }
  async findIncidentCategories(): Promise<IncidentCategoryModel[]> {
    const query = /* sql */ `
      SELECT
          cim.categoria_incidente_id AS "category_id",
          cim.codigo AS "category_code",
          cim.nombre AS "category_name",
          cim.descripcion AS "category_description",
          COALESCE(
              json_agg(
                  json_build_object(
                      'type_code', tim.tipo_incidente_id,
                      'type_name', tim.nombre,
                      'type_description', tim.descripcion,
                      'suggested_priority', tim.prioridad_sugerida
                  ) ORDER BY tim.nombre
              ) FILTER (WHERE tim.tipo_incidente_id IS NOT NULL),
              '[]'::json
          ) AS "incident_types"
      FROM public.categoria_incidente_medidor cim
      LEFT JOIN public.tipo_incidente_medidor tim
          ON cim.categoria_incidente_id = tim.categoria_incidente_id
          AND tim.activo = true
      WHERE cim.activo = true
      GROUP BY
          cim.categoria_incidente_id,
          cim.codigo,
          cim.nombre,
          cim.descripcion
      ORDER BY
          cim.categoria_incidente_id;
    `;
    const result =
      await this.databaseService.query<IncidentCategorySQLResult>(query);
    return result.map((r) =>
      IncidentSQLAdapter.fromIncidentCategorySQLResultToResponse(r),
    );
  }
}
