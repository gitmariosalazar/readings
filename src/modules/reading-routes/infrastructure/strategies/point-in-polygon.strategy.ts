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

  async resolve(
    ctx: RouteResolutionContext,
  ): Promise<RouteResolutionResult | null> {
    if (
      ctx.longitud === undefined ||
      ctx.latitud === undefined ||
      ctx.longitud === null ||
      ctx.latitud === null
    ) {
      return null;
    }

    const query = /*sql*/ `
      WITH punto AS (
          SELECT 
              ST_SetSRID(ST_Point($1, $2), 4326) AS geom,
              ST_SetSRID(ST_Point($1, $2), 4326)::geography AS geog
      )
      SELECT 
          r.id_ruta AS "idRuta",
          r.codigo,
          r.nombre,
          r.sector_id AS "sectorId",
          'POINT_IN_POLYGON' AS "metodoResolucion",
          CASE 
            WHEN ST_Intersects(r.poligono, p.geom) THEN 0.0
            ELSE ROUND(ST_Distance(r.poligono::geography, p.geog)::numeric, 1)
          END AS "distanciaMetros"
      FROM public.ruta_lectura r, punto p
      WHERE r.activa = TRUE
        AND r.poligono IS NOT NULL
        AND (
          ST_Intersects(r.poligono, p.geom)
          OR ST_DWithin(r.poligono::geography, p.geog, 35.0)
        )
      ORDER BY 
        CASE WHEN ST_Intersects(r.poligono, p.geom) THEN 0 ELSE 1 END ASC,
        ST_Distance(r.poligono::geography, p.geog) ASC,
        CASE WHEN $3::INTEGER IS NOT NULL AND r.sector_id = $3::INTEGER THEN 0 ELSE 1 END ASC,
        r.id_ruta ASC
      LIMIT 1;
    `;

    const rows = await this.databaseService.query<RouteResolutionResult>(
      query,
      [ctx.longitud, ctx.latitud, ctx.sectorId ?? null],
    );

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
