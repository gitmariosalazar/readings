import { Injectable } from '@nestjs/common';
import { DatabaseAbstract } from '../../../../shared/connections/database/abstract/abstract.database';
import {
  IRouteResolutionStrategy,
  RouteResolutionContext,
  RouteResolutionResult,
} from '../../domain/contracts/route-resolution-strategy.interface';

@Injectable()
export class SectorCadastralFallbackStrategy implements IRouteResolutionStrategy {
  name = 'SECTOR_FALLBACK';
  priority = 3;

  constructor(private readonly databaseService: DatabaseAbstract) {}

  async resolve(ctx: RouteResolutionContext): Promise<RouteResolutionResult | null> {
    if (!ctx.sectorId) {
      return null;
    }

    const query = /*sql*/ `
      SELECT 
          r.id_ruta AS "idRuta",
          r.codigo,
          r.nombre,
          r.sector_id AS "sectorId",
          'SECTOR_FALLBACK' AS "metodoResolucion",
          99999.0 AS "distanciaMetros"
      FROM public.ruta_lectura r
      WHERE r.activa = TRUE
        AND r.sector_id = $1
      ORDER BY r.cantidad_acometidas ASC
      LIMIT 1;
    `;

    const rows = await this.databaseService.query<RouteResolutionResult>(query, [
      ctx.sectorId,
    ]);

    if (!rows || rows.length === 0) {
      return null;
    }

    return {
      idRuta: Number(rows[0].idRuta),
      codigo: rows[0].codigo,
      nombre: rows[0].nombre,
      sectorId: Number(rows[0].sectorId),
      metodoResolucion: rows[0].metodoResolucion,
      distanciaMetros: Number(rows[0].distanciaMetros || 99999),
    };
  }
}
