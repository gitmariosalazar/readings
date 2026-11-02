import { Injectable } from '@nestjs/common';
import { DatabaseAbstract } from '../../../../shared/connections/database/abstract/abstract.database';
import {
  IRouteResolutionStrategy,
  RouteResolutionContext,
  RouteResolutionResult,
} from '../../domain/contracts/route-resolution-strategy.interface';

@Injectable()
export class PointInPolygonStrategy implements IRouteResolutionStrategy {
  name = 'POINT_IN_POLYGON';
  priority = 1;

  constructor(private readonly databaseService: DatabaseAbstract) {}

  async resolve(ctx: RouteResolutionContext): Promise<RouteResolutionResult | null> {
    if (ctx.longitud === undefined || ctx.latitud === undefined || ctx.longitud === null || ctx.latitud === null) {
      return null;
    }

    const query = /*sql*/ `
      SELECT 
          r.id_ruta AS "idRuta",
          r.codigo,
          r.nombre,
          r.sector_id AS "sectorId",
          'POINT_IN_POLYGON' AS "metodoResolucion",
          0.0 AS "distanciaMetros"
      FROM public.ruta_lectura r
      WHERE r.activa = TRUE
        AND ST_Within(ST_SetSRID(ST_Point($1, $2), 4326), r.poligono)
      LIMIT 1;
    `;

    const rows = await this.databaseService.query<RouteResolutionResult>(query, [
      ctx.longitud,
      ctx.latitud,
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
      distanciaMetros: Number(rows[0].distanciaMetros || 0),
    };
  }
}
