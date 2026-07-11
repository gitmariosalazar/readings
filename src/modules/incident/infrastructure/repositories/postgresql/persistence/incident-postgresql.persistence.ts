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
import { IncidentDetailRowResponse } from '../../../../domain/schemas/response/view_incident.response';
import { IncidentAdapter } from '../../../adapters/incident.adapter';
import { IncidentDetailRowSQLResult } from '../../../interfaces/sql/view_incidents.sql-result';

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
          const insertQuery = /* sql */ `
          INSERT INTO public.incidente_medidor (
            acometida_id, lectura_id, tipo_incidente_id, descripcion_reporte,
            direccion_referencia, origen_reporte, prioridad, usuario_reporta_id,
            cliente_usuario_reporta_id, coordenadas, datos_reportante
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9,
            CASE WHEN $10::double precision IS NOT NULL AND $11::double precision IS NOT NULL
                 THEN ST_SetSRID(ST_MakePoint($11, $10), 4326) ELSE NULL END,
            $12
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
            const insertPhotoQuery = /* sql */ `
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
  ): Promise<IncidentDetailRowResponse[]> {
    const query = /* sql */ `
      SELECT 
        *
      FROM public.view_incidentes_detalle
      WHERE connection_id = $1
      ORDER BY report_date DESC;
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
        *
      FROM public.view_incidentes_detalle
      WHERE incident_id = $1::uuid;
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
  }): Promise<IncidentDetailRowResponse[]> {
    let query = /* sql */ `
      SELECT * FROM view_incidentes_detalle i WHERE 1=1
    `;

    const values: any[] = [];
    let paramIndex = 1;

    if (filters.connectionId) {
      query += /* sql */ ` AND i.connection_id = $${paramIndex}`;
      values.push(filters.connectionId);
      paramIndex++;
    }

    if (filters.status) {
      query += /* sql */ ` AND i.status = $${paramIndex}`;
      values.push(filters.status);
      paramIndex++;
    }

    if (filters.priority) {
      query += /* sql */ ` AND i.current_priority = $${paramIndex}`;
      values.push(filters.priority);
      paramIndex++;
    }

    if (filters.categoryId) {
      query += /* sql */ ` AND i.category_id = $${paramIndex}`;
      values.push(filters.categoryId);
      paramIndex++;
    }

    if (filters.sector) {
      query += /* sql */ ` AND CAST(split_part(i.connection_id, '-', 1) AS INTEGER) = $${paramIndex}`;
      values.push(filters.sector);
      paramIndex++;
    }

    if (filters.reference) {
      query += /* sql */ ` AND i.reference_address ILIKE $${paramIndex}`;
      values.push(`%${filters.reference}%`);
      paramIndex++;
    }

    if (filters.reportDate) {
      query += /* sql */ ` AND i.report_date::date = $${paramIndex}`;
      values.push(filters.reportDate);
      paramIndex++;
    }

    query += /* sql */ ` ORDER BY i.report_date DESC;`;

    const result = await this.databaseService.query<IncidentDetailRowSQLResult>(
      query,
      values,
    );
    return IncidentAdapter.fromSQLResultListToResponseList(result);
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
