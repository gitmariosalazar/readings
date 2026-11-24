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
      WITH punto AS (
          SELECT 
              ST_SetSRID(ST_Point($1, $2), 4326) AS geom,
              ST_SetSRID(ST_Point($1, $2), 4326)::geography AS geog
      ),
      candidatos_bbox AS (
          SELECT 
              r.id_ruta,
              r.codigo,
              r.nombre,
              r.sector_id,
              r.poligono
          FROM public.ruta_lectura r, punto p
          WHERE r.activa = TRUE
            AND r.poligono IS NOT NULL
          ORDER BY r.poligono <-> p.geom
          LIMIT 5
      )
      SELECT 
          c.id_ruta AS "idRuta",
          c.codigo,
          c.nombre,
          c.sector_id AS "sectorId",
          'NEAREST_CENTROID_KNN' AS "metodoResolucion",
          ROUND(ST_Distance(c.poligono::geography, p.geog)::numeric, 1) AS "distanciaMetros"
      FROM candidatos_bbox c, punto p
      ORDER BY 
          ST_Distance(c.poligono::geography, p.geog) ASC,
          CASE WHEN $3::INTEGER IS NOT NULL AND c.sector_id = $3::INTEGER THEN 0 ELSE 1 END ASC,
          c.id_ruta ASC
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
