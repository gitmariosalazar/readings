import { Injectable } from '@nestjs/common';
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

@Injectable()
export class IncidentPersistencePostgreSQL implements InterfaceIncidentRepository {
  constructor(private readonly databaseService: DatabaseAbstract) {}

  async createIncident(
    incident: IncidentModel,
    images: string[],
  ): Promise<IncidentModel | null> {
    try {
      return await this.databaseService.transaction(
        async (client: IDatabaseClient) => {
          // 1. Insert incident
          const insertQuery = `
          INSERT INTO public.incidente_medidor (
            acometida_id, lectura_id, tipo_incidente_id, descripcion_reporte,
            direccion_referencia, origen_reporte, prioridad, usuario_reporta_id,
            cliente_usuario_reporta_id, coordenadas
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9,
            CASE WHEN $10::double precision IS NOT NULL AND $11::double precision IS NOT NULL 
                 THEN ST_SetSRID(ST_MakePoint($11, $10), 4326) ELSE NULL END
          )
          RETURNING 
            incidente_id AS incident_id, acometida_id, lectura_id, tipo_incidente_id, descripcion_reporte,
            direccion_referencia, estado, origen_reporte, prioridad, fecha_reporte, usuario_reporta_id,
            cliente_usuario_reporta_id, ST_X(coordenadas) as longitude, ST_Y(coordenadas) as latitude,
            fecha_resolucion, usuario_resuelve_id, descripcion_resolucion, cobrar_a_usuario, costo_reparacion;
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
          ]);

          if (result.length === 0) return null;
          const createdIncident = result[0];

          // 2. Insert photos
          if (images.length > 0) {
            const insertPhotoQuery = `
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
        message: `Error al crear el incidente en PostgreSQL: ${err.message}`,
      });
    }
  }

  async resolveIncident(
    incidentId: number,
    resolverUserId: UUID,
    description: string,
    repairCost: number,
    chargeToUser: boolean,
    images: string[],
  ): Promise<IncidentModel | null> {
    try {
      return await this.databaseService.transaction(
        async (client: IDatabaseClient) => {
          // 1. Update incident state
          const updateQuery = `
          UPDATE public.incidente_medidor
          SET
            estado = 'RESUELTO',
            fecha_resolucion = NOW(),
            usuario_resuelve_id = $1,
            descripcion_resolucion = $2,
            costo_reparacion = $3,
            cobrar_a_usuario = $4,
            updated_at = NOW()
          WHERE incidente_id = $5
          RETURNING
            incidente_id AS incident_id, acometida_id, lectura_id, tipo_incidente_id, descripcion_reporte,
            direccion_referencia, estado, origen_reporte, prioridad, fecha_reporte, usuario_reporta_id,
            cliente_usuario_reporta_id, ST_X(coordenadas) as longitude, ST_Y(coordenadas) as latitude,
            fecha_resolucion, usuario_resuelve_id, descripcion_resolucion, cobrar_a_usuario, costo_reparacion;
        `;

          const result = await client.query<IncidentSQLResult>(updateQuery, [
            resolverUserId,
            description,
            repairCost,
            chargeToUser,
            incidentId,
          ]);

          if (result.length === 0) return null;
          const resolvedIncident = result[0];

          // 2. Insert resolution photos
          if (images.length > 0) {
            const insertPhotoQuery = `
            INSERT INTO public.foto_incidente (incidente_id, ruta_archivo, tipo_foto)
            VALUES ($1, $2, 'RESOLUCION');
          `;
            for (const url of images) {
              await client.query(insertPhotoQuery, [incidentId, url]);
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
  ): Promise<IncidentModel[]> {
    const query = `
      SELECT 
        incidente_id AS incident_id, acometida_id, lectura_id, tipo_incidente_id, descripcion_reporte,
        direccion_referencia, estado, origen_reporte, prioridad, fecha_reporte, usuario_reporta_id,
        cliente_usuario_reporta_id, ST_X(coordenadas) as longitude, ST_Y(coordenadas) as latitude,
        fecha_resolucion, usuario_resuelve_id, descripcion_resolucion, cobrar_a_usuario, costo_reparacion
      FROM public.incidente_medidor
      WHERE acometida_id = $1
      ORDER BY fecha_reporte DESC;
    `;
    const result = await this.databaseService.query<IncidentSQLResult>(query, [
      connectionId,
    ]);
    return result.map((r) => IncidentSQLAdapter.fromSQLResultToModel(r));
  }

  async findById(incidentId: number): Promise<IncidentModel | null> {
    const query = `
      SELECT 
        incidente_id AS incident_id, acometida_id, lectura_id, tipo_incidente_id, descripcion_reporte,
        direccion_referencia, estado, origen_reporte, prioridad, fecha_reporte, usuario_reporta_id,
        cliente_usuario_reporta_id, ST_X(coordenadas) as longitude, ST_Y(coordenadas) as latitude,
        fecha_resolucion, usuario_resuelve_id, descripcion_resolucion, cobrar_a_usuario, costo_reparacion
      FROM public.incidente_medidor
      WHERE incidente_id = $1;
    `;
    const result = await this.databaseService.query<IncidentSQLResult>(query, [
      incidentId,
    ]);
    if (result.length === 0) return null;
    return IncidentSQLAdapter.fromSQLResultToModel(result[0]);
  }

  async findIncidents(filters: {
    connectionId?: string | null;
    status?: string | null;
    priority?: string | null;
    incidentTypeId?: number | null;
  }): Promise<IncidentModel[]> {
    let query = `
      SELECT 
        i.incidente_id AS incident_id,
        i.acometida_id AS acometida_id,
        i.lectura_id AS lectura_id,
        i.estado AS estado,
        i.origen_reporte AS origen_reporte,
        i.prioridad AS prioridad,
        i.fecha_reporte AS fecha_reporte,
        i.descripcion_reporte AS descripcion_reporte,
        i.direccion_referencia AS direccion_referencia,
        ST_Y(i.coordenadas) AS latitude,
        ST_X(i.coordenadas) AS longitude,
        i.usuario_reporta_id AS usuario_reporta_id,
        i.cliente_usuario_reporta_id AS cliente_usuario_reporta_id,
        i.fecha_resolucion AS fecha_resolucion,
        i.usuario_resuelve_id AS usuario_resuelve_id,
        i.descripcion_resolucion AS descripcion_resolucion,
        i.costo_reparacion AS costo_reparacion,
        i.cobrar_a_usuario AS cobrar_a_usuario,
        c.nombre AS "categoryName",
        c.codigo AS "categoryCode",
        t.nombre AS "incidentTypeName",
        t.prioridad_sugerida AS "suggestedPriority",
        CASE 
          WHEN i.usuario_reporta_id IS NOT NULL THEN 'EMPLOYEE: ' || u_rep.username || ' (' || u_rep.email || ')'
          WHEN i.cliente_usuario_reporta_id IS NOT NULL THEN 'CLIENT: ID ' || c_rep.cliente_id || ' (' || c_rep.email || ')'
          ELSE 'SYSTEM/ANONYMOUS'
        END AS "reportedBy",
        (
          SELECT COALESCE(
            json_agg(
              json_build_object(
                'photoId', f.foto_incidente_id,
                'filePath', f.ruta_archivo,
                'type', f.tipo_foto
              )
            ),
            '[]'::json
          )
          FROM public.foto_incidente f
          WHERE f.incidente_id = i.incidente_id
        ) AS "evidencePhotos",
        (
          SELECT COALESCE(
            json_agg(
              json_build_object(
                'changeDate', h.fecha_cambio,
                'previousStatus', h.estado_anterior,
                'newStatus', h.estado_nuevo,
                'managedBy', u_hist.username,
                'observation', h.observacion
              ) ORDER BY h.fecha_cambio ASC
            ),
            '[]'::json
          )
          FROM public.historial_incidente h
          LEFT JOIN public.usuarios u_hist ON u_hist.usuario_id = h.usuario_id
          WHERE h.incidente_id = i.incidente_id
        ) AS "statusHistory"
      FROM public.incidente_medidor i
      INNER JOIN public.tipo_incidente_medidor t ON t.tipo_incidente_id = i.tipo_incidente_id
      INNER JOIN public.categoria_incidente_medidor c ON c.categoria_incidente_id = t.categoria_incidente_id
      LEFT JOIN public.usuarios u_rep ON u_rep.usuario_id = i.usuario_reporta_id
      LEFT JOIN public.cliente_usuario c_rep ON c_rep.cliente_usuario_id = i.cliente_usuario_reporta_id
      LEFT JOIN public.usuarios u_res ON u_res.usuario_id = i.usuario_resuelve_id
      WHERE 1=1
    `;

    const values: any[] = [];
    let paramIndex = 1;

    if (filters.connectionId) {
      query += ` AND i.acometida_id = $${paramIndex}`;
      values.push(filters.connectionId);
      paramIndex++;
    }

    if (filters.status) {
      query += ` AND i.estado = $${paramIndex}`;
      values.push(filters.status);
      paramIndex++;
    }

    if (filters.priority) {
      query += ` AND i.prioridad = $${paramIndex}`;
      values.push(filters.priority);
      paramIndex++;
    }

    if (filters.incidentTypeId) {
      query += ` AND i.tipo_incidente_id = $${paramIndex}`;
      values.push(filters.incidentTypeId);
      paramIndex++;
    }

    query += ` ORDER BY i.fecha_reporte DESC;`;

    const result = await this.databaseService.query<IncidentSQLResult>(
      query,
      values,
    );
    return result.map((r) => IncidentSQLAdapter.fromSQLResultToModel(r));
  }

  async findIncidentCategories(): Promise<IncidentCategoryModel[]> {
    const query = `
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
