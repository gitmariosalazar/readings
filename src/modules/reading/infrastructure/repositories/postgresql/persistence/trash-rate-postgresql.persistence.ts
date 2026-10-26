import { Injectable, Logger } from '@nestjs/common';
import { InterfaceTrashRateRepository } from '../../../../domain/contracts/trash-rate.interface.repository';
import {
  EmelnorteCustomerDataModel,
  TrashRateAssignmentModel,
  TrashRateCategoryTariffModel,
  TrashRateRangeModel,
} from '../../../../domain/schemas/model/trash-rate.model';
import { DatabaseAbstract } from '../../../../../../shared/connections/database/abstract/abstract.database';

@Injectable()
export class TrashRatePostgreSQLPersistence
  implements InterfaceTrashRateRepository
{
  private readonly logger = new Logger(TrashRatePostgreSQLPersistence.name);

  constructor(private readonly databaseService: DatabaseAbstract) {}

  async findActiveAssignmentByConnection(
    connectionId: string,
  ): Promise<TrashRateAssignmentModel | null> {
    try {
      const query = /*sql*/ `
        SELECT 
            atb.id_acometida_tasa_basura AS "id",
            atb.acometida_id AS "connectionId",
            atb.cliente_id_origen AS "originClientId",
            atb.valor_asignado AS "assignedAmount",
            atb.origen_asignacion AS "origin",
            atb.version_origen AS "versionSheet",
            atb.valor_total_cliente_origen AS "totalClientOrigin",
            atb.cantidad_emelnorte_origen AS "emelnorteQuantityOrigin",
            atb.total_acometidas_activas AS "totalActiveConnections",
            atb.diferencia_catastro_emelnorte AS "hasCadastralMismatch",
            atb.es_residuo_centavo AS "isPennyRemainder",
            atb.activo AS "isActive",
            atb.fecha_inicio AS "startDate",
            atb.fecha_fin AS "endDate",
            atb.observacion AS "observation"
        FROM acometida_tasa_basura atb
        WHERE (atb.acometida_id = $1 OR EXISTS (SELECT 1 FROM acometida a WHERE a.clave_catastral = $1 AND a.acometida_id = atb.acometida_id))
          AND atb.activo IS TRUE
          AND atb.fecha_inicio <= CURRENT_DATE
          AND (atb.fecha_fin IS NULL OR atb.fecha_fin >= CURRENT_DATE)
        ORDER BY atb.fecha_inicio DESC
        LIMIT 1;
      `;
      const rows = await this.databaseService.query<any>(query, [connectionId]);
      if (!rows || rows.length === 0) {
        return null;
      }
      const r = rows[0];
      return new TrashRateAssignmentModel(
        r.connectionId,
        r.originClientId,
        Number(r.assignedAmount),
        r.origin,
        r.versionSheet,
        Number(r.id),
        r.totalClientOrigin != null ? Number(r.totalClientOrigin) : null,
        r.emelnorteQuantityOrigin != null ? Number(r.emelnorteQuantityOrigin) : null,
        r.totalActiveConnections != null ? Number(r.totalActiveConnections) : null,
        Boolean(r.hasCadastralMismatch),
        Boolean(r.isPennyRemainder),
        Boolean(r.isActive),
        r.startDate ? new Date(r.startDate) : new Date(),
        r.endDate ? new Date(r.endDate) : null,
        r.observation ?? null,
      );
    } catch (error: any) {
      if (error?.code === '42P01') {
        return null;
      }
      this.logger.warn(
        `Error consultando asignación de tasa de basura para acometida "${connectionId}": ${error?.message || error}`,
      );
      return null;
    }
  }

  async findActiveCategoryTariff(
    categoryId: number,
    _versionSheet?: string,
  ): Promise<TrashRateCategoryTariffModel | null> {
    try {
      const query = /*sql*/ `
        SELECT 
            ttbc.id_tarifa_tasa_basura_categoria AS "id",
            ttbc.categoria_id AS "categoryId",
            c.nombre AS "categoryName",
            ttbc.tipo_cobro AS "billingType",
            ttbc.valor_fijo AS "fixedValue",
            ttbc.valor_minimo AS "minimumValue",
            ptb.codigo_version AS "versionSheet"
        FROM tarifa_tasa_basura_categoria ttbc
        JOIN pliego_tasa_basura ptb ON ptb.id_pliego_tasa_basura = ttbc.id_pliego_tasa_basura
        JOIN categoria c ON c.categoria_id = ttbc.categoria_id
        WHERE ttbc.categoria_id = $1
          AND ptb.activo IS TRUE
          AND ptb.fecha_inicio <= CURRENT_DATE
          AND (ptb.fecha_fin IS NULL OR ptb.fecha_fin >= CURRENT_DATE)
        ORDER BY ptb.fecha_inicio DESC
        LIMIT 1;
      `;
      const rows = await this.databaseService.query<any>(query, [categoryId]);
      if (!rows || rows.length === 0) {
        return null;
      }
      const r = rows[0];

      let ranges: TrashRateRangeModel[] = [];
      if (r.billingType === 'POR_RANGOS_CONSUMO') {
        const rangesQuery = /*sql*/ `
          SELECT 
              rtb.id_rango_tasa_basura AS "id",
              rtb.codigo_version_rango AS "versionSheet",
              rtb.rango_minimo AS "minRange",
              rtb.rango_maximo AS "maxRange",
              rtb.valor AS "value"
          FROM rango_tasa_basura rtb
          WHERE rtb.id_tarifa_tasa_basura_categoria = $1
            AND rtb.activo IS TRUE
            AND rtb.fecha_inicio <= CURRENT_DATE
            AND (rtb.fecha_fin IS NULL OR rtb.fecha_fin >= CURRENT_DATE)
          ORDER BY rtb.rango_minimo ASC;
        `;
        const rangeRows = await this.databaseService.query<any>(rangesQuery, [r.id]);
        ranges = (rangeRows || []).map(
          (rng: any) =>
            new TrashRateRangeModel(
              Number(rng.minRange),
              Number(rng.maxRange),
              Number(rng.value),
              Number(rng.id),
              rng.versionSheet,
            ),
        );
      }

      return new TrashRateCategoryTariffModel(
        Number(r.categoryId),
        r.categoryName,
        r.billingType,
        Number(r.minimumValue ?? 1.0),
        r.fixedValue != null ? Number(r.fixedValue) : null,
        r.versionSheet,
        ranges,
        Number(r.id),
      );
    } catch (error: any) {
      if (error?.code === '42P01') {
        return null;
      }
      this.logger.warn(
        `Error consultando tarifa para categoría "${categoryId}": ${error?.message || error}`,
      );
      return null;
    }
  }

  async saveAssignment(assignment: TrashRateAssignmentModel): Promise<void> {
    try {
      let realConnectionId = assignment.connectionId;
      let realClientId = assignment.originClientId;

      try {
        const acometidaQuery = /*sql*/ `
          SELECT acometida_id, cliente_id
          FROM acometida
          WHERE acometida_id = $1 OR clave_catastral = $1
          LIMIT 1;
        `;
        const acometidaRows = await this.databaseService.query<any>(
          acometidaQuery,
          [assignment.connectionId],
        );
        if (acometidaRows && acometidaRows.length > 0) {
          realConnectionId = acometidaRows[0].acometida_id;
          if (!realClientId || realClientId === assignment.connectionId) {
            realClientId = acometidaRows[0].cliente_id;
          }
        }
      } catch {
        // Fallback a los IDs originales provistos
      }

      const query = /*sql*/ `
        INSERT INTO acometida_tasa_basura (
            acometida_id,
            cliente_id_origen,
            valor_asignado,
            origen_asignacion,
            version_origen,
            valor_total_cliente_origen,
            cantidad_emelnorte_origen,
            total_acometidas_activas,
            diferencia_catastro_emelnorte,
            es_residuo_centavo,
            fecha_inicio,
            activo,
            observacion
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT (acometida_id) WHERE activo IS TRUE
        DO UPDATE SET
            valor_asignado = EXCLUDED.valor_asignado,
            origen_asignacion = EXCLUDED.origen_asignacion,
            version_origen = EXCLUDED.version_origen,
            updated_at = NOW(),
            observacion = EXCLUDED.observacion;
      `;

      await this.databaseService.query(query, [
        realConnectionId,
        realClientId,
        assignment.assignedAmount,
        assignment.origin,
        assignment.versionSheet,
        assignment.totalClientOrigin ?? null,
        assignment.emelnorteQuantityOrigin ?? null,
        assignment.totalActiveConnections ?? null,
        assignment.hasCadastralMismatch,
        assignment.isPennyRemainder,
        assignment.startDate ?? new Date(),
        assignment.isActive,
        assignment.observation ?? null,
      ]);
    } catch (error: any) {
      this.logger.error(
        `Error guardando asignación de tasa de basura para acometida "${assignment.connectionId}":`,
        error,
      );
      throw error;
    }
  }

  async saveBatchAssignments(
    assignments: TrashRateAssignmentModel[],
  ): Promise<void> {
    for (const assignment of assignments) {
      await this.saveAssignment(assignment);
    }
  }

  async getEmelnorteData(
    clientId: string,
  ): Promise<EmelnorteCustomerDataModel | null> {
    try {
      const query = /*sql*/ `
        SELECT 
            identificacion,
            valor_total_tasa_basura_septiembre AS "septemberTotal",
            cantidad_tasa_basura_septiembre AS "septemberQuantity",
            valor_total AS "totalAmount",
            cantidad_total AS "totalQuantity"
        FROM tasa_basura_emelnorte
        WHERE identificacion = $1
        LIMIT 1;
      `;
      const rows = await this.databaseService.query<any>(query, [clientId]);
      if (!rows || rows.length === 0) {
        return null;
      }
      const r = rows[0];
      return {
        identification: r.identificacion,
        septemberTotal: r.septemberTotal != null ? Number(r.septemberTotal) : null,
        septemberQuantity: r.septemberQuantity != null ? Number(r.septemberQuantity) : null,
        totalAmount: r.totalAmount != null ? Number(r.totalAmount) : null,
        totalQuantity: r.totalQuantity != null ? Number(r.totalQuantity) : null,
      };
    } catch (error: any) {
      if (error?.code === '42P01') {
        return null;
      }
      this.logger.warn(
        `Error consultando datos de EMELNORTE para "${clientId}": ${error?.message || error}`,
      );
      return null;
    }
  }

  async getActiveConnectionsByClientId(clientId: string): Promise<string[]> {
    try {
      const query = /*sql*/ `
        SELECT acometida_id AS "connectionId"
        FROM acometida
        WHERE cliente_id = $1 AND estado_id = 1
        ORDER BY acometida_id ASC;
      `;
      const rows = await this.databaseService.query<any>(query, [clientId]);
      return (rows || []).map((r: any) => r.connectionId);
    } catch (error: any) {
      this.logger.error(
        `Error obteniendo acometidas activas para cliente "${clientId}":`,
        error,
      );
      throw error;
    }
  }

  async findClientIdByConnectionId(
    connectionId: string,
  ): Promise<string | null> {
    try {
      const query = /*sql*/ `
        SELECT cliente_id AS "clientId"
        FROM acometida
        WHERE acometida_id = $1 OR clave_catastral = $1
        LIMIT 1;
      `;
      const rows = await this.databaseService.query<any>(query, [connectionId]);
      if (!rows || rows.length === 0) {
        return null;
      }
      return rows[0].clientId ?? null;
    } catch (error: any) {
      if (error?.code === '42P01') {
        return null;
      }
      this.logger.warn(
        `Error consultando cliente para acometida "${connectionId}": ${error?.message || error}`,
      );
      return null;
    }
  }
}
