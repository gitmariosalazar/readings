import { Injectable } from '@nestjs/common';
import { DatabaseAbstract } from '../../../../shared/connections/database/abstract/abstract.database';
import {
  IRouteResolutionStrategy,
  RouteResolutionContext,
  RouteResolutionResult,
} from '../../domain/contracts/route-resolution-strategy.interface';

@Injectable()
export class NearestCentroidKnnStrategy implements IRouteResolutionStrategy {
  name = 'NEAREST_CENTROID_KNN';
  priority = 2;

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
          'NEAREST_CENTROID_KNN' AS "metodoResolucion",
          ROUND(ST_Distance(r.poligono::geography, ST_SetSRID(ST_Point($1, $2), 4326)::geography)::numeric, 1) AS "distanciaMetros"
      FROM public.ruta_lectura r
      WHERE r.activa = TRUE
        AND ($3::INTEGER IS NULL OR r.sector_id = $3::INTEGER)
      ORDER BY r.poligono <-> ST_SetSRID(ST_Point($1, $2), 4326)
      LIMIT 1;
    `;

    const rows = await this.databaseService.query<RouteResolutionResult>(query, [
      ctx.longitud,
      ctx.latitud,
      ctx.sectorId ?? null,
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
