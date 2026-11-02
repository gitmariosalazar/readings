import { Injectable, Inject } from '@nestjs/common';
import { DatabaseAbstract } from '../../../../shared/connections/database/abstract/abstract.database';
import {
  IReadingRouteRepository,
  InsertConnectionParams,
  OptimizeSequenceResult,
  RouteFilterParams,
} from '../../domain/contracts/reading-route.repository.interface';
import { ReadingRouteEntity } from '../../domain/entities/reading-route.entity';
import {
  IRouteResolutionStrategy,
  RouteResolutionResult,
} from '../../domain/contracts/route-resolution-strategy.interface';

@Injectable()
export class PostgresqlReadingRouteRepository implements IReadingRouteRepository {
  constructor(
    private readonly databaseService: DatabaseAbstract,
    @Inject('ROUTE_RESOLUTION_STRATEGIES')
    private readonly strategies: IRouteResolutionStrategy[],
  ) {}

  async findAll(
    filter?: RouteFilterParams,
  ): Promise<{ items: ReadingRouteEntity[]; total: number }> {
    const conditions: string[] = ['1=1'];
    const params: any[] = [];
    let pIdx = 1;

    if (filter?.sectorId !== undefined && filter.sectorId !== null) {
      conditions.push(`r.sector_id = $${pIdx++}`);
      params.push(filter.sectorId);
    }

    if (filter?.activa !== undefined && filter.activa !== null) {
      conditions.push(`r.activa = $${pIdx++}`);
      params.push(filter.activa);
    }

    if (filter?.search) {
      conditions.push(
        `(r.codigo ILIKE $${pIdx} OR r.nombre ILIKE $${pIdx} OR r.descripcion ILIKE $${pIdx})`,
      );
      params.push(`%${filter.search}%`);
      pIdx++;
    }

    const whereClause = conditions.join(' AND ');

    const countQuery = `
      SELECT COUNT(*)::int AS count
      FROM public.ruta_lectura r
      WHERE ${whereClause};
    `;
    const countRows = await this.databaseService.query<{ count: number }>(
      countQuery,
      params,
    );
    const total = countRows[0]?.count ? Number(countRows[0].count) : 0;

    let paginationClause = '';
    if (filter?.limit !== undefined && filter.limit !== null) {
      paginationClause += ` LIMIT $${pIdx++}`;
      params.push(filter.limit);
    }
    if (filter?.offset !== undefined && filter.offset !== null) {
      paginationClause += ` OFFSET $${pIdx++}`;
      params.push(filter.offset);
    }

    // Nota: Las columnas de ruta_lectura según ruta_lectura.sql no incluyen distancia_estimada_km
    const selectQuery = `
      SELECT 
          r.id_ruta AS "idRuta",
          r.sector_id AS "sectorId",
          r.zona_id AS "zonaId",
          r.codigo,
          r.nombre,
          r.descripcion,
          r.cantidad_acometidas AS "cantidadAcometidas",
          r.tiempo_estimado_horas::float AS "tiempoEstimadoHoras",
          r.color_identificador AS "colorIdentificador",
          r.es_rural AS "esRural",
          r.activa,
          r.created_at AS "createdAt",
          r.updated_at AS "updatedAt"
      FROM public.ruta_lectura r
      WHERE ${whereClause}
      ORDER BY r.sector_id ASC, r.id_ruta ASC
      ${paginationClause};
    `;

    const rows = await this.databaseService.query<any>(selectQuery, params);
    const items = rows.map((r) => new ReadingRouteEntity(r));

    return { items, total };
  }

  async findById(id: number): Promise<ReadingRouteEntity | null> {
    const query = `
      SELECT 
          r.id_ruta AS "idRuta",
          r.sector_id AS "sectorId",
          r.zona_id AS "zonaId",
          r.codigo,
          r.nombre,
          r.descripcion,
          r.cantidad_acometidas AS "cantidadAcometidas",
          r.tiempo_estimado_horas::float AS "tiempoEstimadoHoras",
          r.color_identificador AS "colorIdentificador",
          ST_AsGeoJSON(r.poligono) AS "poligono",
          r.es_rural AS "esRural",
          r.activa,
          r.created_at AS "createdAt",
          r.updated_at AS "updatedAt"
      FROM public.ruta_lectura r
      WHERE r.id_ruta = $1
      LIMIT 1;
    `;

    const rows = await this.databaseService.query<any>(query, [id]);
    if (!rows || rows.length === 0) {
      return null;
    }

    return new ReadingRouteEntity(rows[0]);
  }

  async getRoutesGeoJson(filter?: {
    sectorId?: number;
    activa?: boolean;
  }): Promise<any> {
    const query = /*sql*/ `
      SELECT json_build_object(
          'type', 'FeatureCollection',
          'features', COALESCE(json_agg(
              json_build_object(
                  'type', 'Feature',
                  'id', r.id_ruta,
                  'geometry', ST_AsGeoJSON(r.poligono)::json,
                  'properties', json_build_object(
                      'idRuta', r.id_ruta,
                      'codigo', r.codigo,
                      'nombre', r.nombre,
                      'sectorId', r.sector_id,
                      'cantidadAcometidas', r.cantidad_acometidas,
                      'tiempoEstimadoHoras', r.tiempo_estimado_horas,
                      'esRural', r.es_rural,
                      'activa', r.activa,
                      'stroke', r.color_identificador,
                      'fill', r.color_identificador,
                      'fill-opacity', 0.25,
                      'stroke-width', 2
                  )
              )
          ), '[]'::json)
      ) AS geojson
      FROM public.ruta_lectura r
      WHERE ($1::BOOLEAN IS NULL OR r.activa = $1::BOOLEAN)
        AND ($2::INTEGER IS NULL OR r.sector_id = $2::INTEGER);
    `;

    const rows = await this.databaseService.query<{ geojson: any }>(query, [
      filter?.activa ?? null,
      filter?.sectorId ?? null,
    ]);

    return rows[0]?.geojson || { type: 'FeatureCollection', features: [] };
  }

  async getCentroidsGeoJson(activaOnly: boolean = true): Promise<any> {
    const query = /*sql*/ `
      SELECT json_build_object(
          'type', 'FeatureCollection',
          'features', COALESCE(json_agg(
              json_build_object(
                  'type', 'Feature',
                  'geometry', ST_AsGeoJSON(ST_Centroid(r.poligono))::json,
                  'properties', json_build_object(
                      'numero', r.id_ruta,
                      'idRuta', r.id_ruta,
                      'codigo', r.codigo,
                      'nombre', r.nombre,
                      'sectorId', r.sector_id,
                      'acometidas', r.cantidad_acometidas,
                      'latitud', ROUND(ST_Y(ST_Centroid(r.poligono))::numeric, 6)::double precision,
                      'longitud', ROUND(ST_X(ST_Centroid(r.poligono))::numeric, 6)::double precision,
                      'title', '#' || r.id_ruta || ' | ' || r.codigo,
                      'marker-color', r.color_identificador,
                      'marker-size', 'medium'
                  )
              )
          ), '[]'::json)
      ) AS geojson
      FROM public.ruta_lectura r
      WHERE ($1::BOOLEAN IS NULL OR r.activa = $1::BOOLEAN);
    `;

    const rows = await this.databaseService.query<{ geojson: any }>(query, [
      activaOnly ? true : null,
    ]);

    return rows[0]?.geojson || { type: 'FeatureCollection', features: [] };
  }

  async getRouteConnections(idRuta: number): Promise<any[]> {
    const query = /*sql*/ `
      SELECT
          ra.id_ruta_acometida AS "idRutaAcometida",
          ra.ruta_id AS "rutaId",
          ra.acometida_id AS "acometidaId",
          ra.orden_secuencia AS "ordenSecuencia",
          ra.lado_calle AS "ladoCalle",
          ra.piso_departamento AS "pisoDepartamento",
          ra.instruccion_acceso AS "instruccionAcceso",
          ra.activo,
          a.cuenta,
          a.numero_medidor AS "numeroMedidor",
          COALESCE(TRIM(ci.nombres || ' ' || ci.apellidos), e.razon_social, 'SIN NOMBRE') AS "abonado",
          a.direccion,
          a.referencia,
          ROUND(ST_Y(COALESCE(a.ubicacion_ruta, a.coordenadas))::numeric, 6)::double precision AS "latitud",
          ROUND(ST_X(COALESCE(a.ubicacion_ruta, a.coordenadas))::numeric, 6)::double precision AS "longitud",
          cp.average_consumption AS "consumoPromedio"
      FROM public.ruta_acometida ra
      JOIN public.acometida a ON ra.acometida_id = a.acometida_id
      INNER JOIN public.consumo_promedio cp ON cp.acometida_id = a.acometida_id
      LEFT JOIN public.cliente c ON a.cliente_id = c.cliente_id
      LEFT JOIN public.ciudadano ci ON ci.ciudadano_id = c.cliente_id
      LEFT JOIN public.empresa e ON e.ruc = c.cliente_id
      WHERE ra.ruta_id = $1 AND ra.activo = TRUE
      ORDER BY ra.orden_secuencia ASC;
    `;

    return this.databaseService.query<any>(query, [idRuta]);
  }

  async resolveRouteByCoordinates(
    longitud: number,
    latitud: number,
    sectorId?: number,
  ): Promise<RouteResolutionResult | null> {
    const sortedStrategies = [...this.strategies].sort(
      (a, b) => a.priority - b.priority,
    );

    for (const strategy of sortedStrategies) {
      const result = await strategy.resolve({ longitud, latitud, sectorId });
      if (result) {
        return result;
      }
    }

    return null;
  }

  async getNextSequenceNumber(idRuta: number): Promise<number> {
    const query = `
      SELECT COALESCE(MAX(orden_secuencia), 0) + 1 AS "nextSeq"
      FROM public.ruta_acometida
      WHERE ruta_id = $1 AND activo = TRUE;
    `;

    const rows = await this.databaseService.query<{ nextSeq: number }>(query, [
      idRuta,
    ]);
    return Number(rows[0]?.nextSeq || 1);
  }

  async insertConnection(params: InsertConnectionParams): Promise<void> {
    const query = `
      SELECT public.fn_insertar_acometida_en_secuencia(
          $1::integer,
          $2::varchar,
          $3::integer,
          $4::varchar,
          $5::text
      );
    `;

    await this.databaseService.query(query, [
      params.idRuta,
      params.acometidaId,
      params.ordenSugerido ?? 999999,
      params.ladoCalle ?? 'DERECHA',
      params.instruccionAcceso ?? null,
    ]);
  }

  async optimizeRouteSequence(
    idRuta: number,
    acometidaInicio?: string,
  ): Promise<OptimizeSequenceResult> {
    const query = `
      SELECT 
          total_reordenadas AS "totalReordenadas",
          distancia_total_caminada_metros AS "distanciaTotalCaminadaMetros"
      FROM public.fn_aplicar_secuencia_optima_ruta($1::integer, $2::varchar);
    `;

    const rows = await this.databaseService.query<any>(query, [
      idRuta,
      acometidaInicio ?? null,
    ]);

    if (!rows || rows.length === 0) {
      return { totalReordenadas: 0, distanciaTotalCaminadaMetros: 0 };
    }

    return {
      totalReordenadas: Number(rows[0].totalReordenadas || 0),
      distanciaTotalCaminadaMetros: Number(
        rows[0].distanciaTotalCaminadaMetros || 0,
      ),
    };
  }
}
