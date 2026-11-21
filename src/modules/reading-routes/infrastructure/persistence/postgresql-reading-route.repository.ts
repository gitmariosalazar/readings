import { Injectable, Inject } from '@nestjs/common';
import { DatabaseAbstract } from '../../../../shared/connections/database/abstract/abstract.database';
import {
  IReadingRouteRepository,
  InsertConnectionParams,
  OptimizeSequenceResult,
  RouteFilterParams,
  RouteGeoJsonFilter,
} from '../../domain/contracts/reading-route.repository.interface';
import { ReadingRouteEntity } from '../../domain/entities/reading-route.entity';
import {
  IRouteResolutionStrategy,
  RouteResolutionResult,
} from '../../domain/contracts/route-resolution-strategy.interface';
import { RouteConnectionModel } from '../../domain/entities/route-connection.entity';
import { RouteConnectionSqlResult } from '../interfaces/reading-route.interface';
import { ReadingRouteAdapters } from '../adapters/reading-route.adapters';

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

    let joinAssignment = '';
    if (
      filter?.periodo !== undefined &&
      filter.periodo !== null &&
      String(filter.periodo).trim() !== ''
    ) {
      joinAssignment = `LEFT JOIN LATERAL (
        SELECT *
        FROM public.asignacion_ruta ar
        WHERE ar.ruta_id = r.id_ruta
          AND ar.periodo_mes = $${pIdx++}
        ORDER BY ar.id_asignacion DESC
        LIMIT 1
      ) ar ON true`;
      params.push(String(filter.periodo).trim());
    } else {
      joinAssignment = `LEFT JOIN LATERAL (
        SELECT *
        FROM public.asignacion_ruta ar
        WHERE ar.ruta_id = r.id_ruta
        ORDER BY ar.id_asignacion DESC
        LIMIT 1
      ) ar ON true`;
    }

    if (filter?.sectorId !== undefined && filter.sectorId !== null) {
      conditions.push(`r.sector_id = $${pIdx++}`);
      params.push(filter.sectorId);
    }

    if (filter?.activa !== undefined && filter.activa !== null) {
      conditions.push(`r.activa = $${pIdx++}`);
      params.push(filter.activa);
    }

    // Manejo del estado:
    // 1) null, undefined, '', 'NO_ASIGNADA', 'SIN_ASIGNAR': Rutas NO asignadas (ar.id_asignacion IS NULL)
    // 2) 'TODOS', 'ALL': No filtra por asignación (trae todas)
    // 3) 'ACTIVO', 'ACTIVA': Hace referencia a r.activa = true
    // 4) Otro valor ('ASIGNADA', 'EN_PROCESO', 'COMPLETADA', etc.): Filtra por ar.estado
    const estadoRaw = filter?.estado;
    const estadoTrimmed =
      typeof estadoRaw === 'string' ? estadoRaw.trim() : estadoRaw;

    if (
      estadoTrimmed === undefined ||
      estadoTrimmed === null ||
      estadoTrimmed === ''
    ) {
      // Requerimiento: cuando envía null o vacío debe traer las que aún no están asignadas
      conditions.push(`ar.id_asignacion IS NULL`);
    } else {
      const estadoUpper = String(estadoTrimmed).toUpperCase();
      if (
        estadoUpper === 'NO_ASIGNADA' ||
        estadoUpper === 'SIN_ASIGNAR' ||
        estadoUpper === 'UNASSIGNED'
      ) {
        conditions.push(`ar.id_asignacion IS NULL`);
      } else if (estadoUpper === 'TODOS' || estadoUpper === 'ALL') {
        // No se agrega condición de asignación para retornar todas
      } else if (estadoUpper === 'ACTIVO' || estadoUpper === 'ACTIVA') {
        if (filter?.activa === undefined || filter?.activa === null) {
          conditions.push(`r.activa = true`);
        }
      } else if (estadoUpper === 'EN_CURSO') {
        conditions.push(`ar.estado = $${pIdx++}`);
        params.push('EN_PROCESO');
      } else {
        conditions.push(`ar.estado = $${pIdx++}`);
        params.push(estadoUpper);
      }
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
      ${joinAssignment}
      WHERE ${whereClause};
    `;
    const countRows = await this.databaseService.query<{ count: number }>(
      countQuery,
      params,
    );
    const total = countRows[0]?.count ? Number(countRows[0].count) : 0;

    let paginationClause = '';
    const queryParams = [...params];
    if (filter?.limit !== undefined && filter.limit !== null) {
      paginationClause += ` LIMIT $${pIdx++}`;
      queryParams.push(filter.limit);
    }
    if (filter?.offset !== undefined && filter.offset !== null) {
      paginationClause += ` OFFSET $${pIdx++}`;
      queryParams.push(filter.offset);
    }

    // Nota: Las columnas de ruta_lectura según ruta_lectura.sql no incluyen distancia_estimada_km
    const selectQuery = /*sql*/ `
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
          ar.id_asignacion AS "idAsignacion",
          ar.estado AS "estado",
          ar.usuario_id AS "idUsuarioAsignado",
          COALESCE(e.nombres || ' ' || e.apellidos) AS "nombreUsuario",
          u.username AS usuario,
          ar.periodo_mes AS "periodo",
          ar.fecha_inicio AS "fechaInicio",
          ar.fecha_fin AS "fechaFin",
          ar.lecturas_esperadas AS "lecturasEsperadas",
          ar.lecturas_completadas AS "lecturasCompletadas",
          ar.lecturas_pendientes AS "lecturasPendientes",
          ar.observacion_supervisor AS "observacionSupervisor",
          r.created_at AS "createdAt",
          r.updated_at AS "updatedAt"
      FROM public.ruta_lectura r
      ${joinAssignment}
      LEFT JOIN public.usuarios u on ar.usuario_id = u.usuario_id
      LEFT JOIN public.empleados e on e.usuario_id = u.usuario_id
      WHERE ${whereClause}
      ORDER BY r.sector_id ASC, r.id_ruta ASC
      ${paginationClause};
    `;

    const rows = await this.databaseService.query<any>(selectQuery, queryParams);
    const items = rows.map((r) => new ReadingRouteEntity(r));

    return { items, total };
  }

  async findById(id: number): Promise<ReadingRouteEntity | null> {
    const query = /*sql*/ `
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
          ar.id_asignacion AS "idAsignacion",
          ar.estado AS "estado",
          ar.usuario_id AS "idUsuarioAsignado",
          COALESCE(e.nombres || ' ' || e.apellidos) AS "nombreUsuario",
          u.username AS usuario,
          ar.periodo_mes AS "periodo",
          ar.fecha_inicio AS "fechaInicio",
          ar.fecha_fin AS "fechaFin",
          ar.lecturas_esperadas AS "lecturasEsperadas",
          ar.lecturas_completadas AS "lecturasCompletadas",
          ar.lecturas_pendientes AS "lecturasPendientes",
          ar.observacion_supervisor AS "observacionSupervisor",
          r.created_at AS "createdAt",
          r.updated_at AS "updatedAt"
      FROM public.ruta_lectura r
      LEFT JOIN LATERAL (
        SELECT *
        FROM public.asignacion_ruta ar
        WHERE ar.ruta_id = r.id_ruta
        ORDER BY ar.id_asignacion DESC
        LIMIT 1
      ) ar ON true
      LEFT JOIN public.usuarios u on ar.usuario_id = u.usuario_id
      LEFT JOIN public.empleados e on e.usuario_id = u.usuario_id
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
    estado?: string;
    periodo?: string;
  }): Promise<any> {
    const conditions: string[] = ['r.poligono IS NOT NULL'];
    const params: any[] = [];
    let pIdx = 1;

    let joinAssignment = '';
    if (
      filter?.periodo !== undefined &&
      filter.periodo !== null &&
      String(filter.periodo).trim() !== ''
    ) {
      joinAssignment = `LEFT JOIN LATERAL (
        SELECT *
        FROM public.asignacion_ruta ar
        WHERE ar.ruta_id = r.id_ruta
          AND ar.periodo_mes = $${pIdx++}
        ORDER BY ar.id_asignacion DESC
        LIMIT 1
      ) ar ON true`;
      params.push(String(filter.periodo).trim());
    } else {
      joinAssignment = `LEFT JOIN LATERAL (
        SELECT *
        FROM public.asignacion_ruta ar
        WHERE ar.ruta_id = r.id_ruta
        ORDER BY ar.id_asignacion DESC
        LIMIT 1
      ) ar ON true`;
    }

    if (filter?.activa !== undefined && filter.activa !== null) {
      conditions.push(`r.activa = $${pIdx++}`);
      params.push(filter.activa);
    }

    if (filter?.sectorId !== undefined && filter.sectorId !== null) {
      conditions.push(`r.sector_id = $${pIdx++}`);
      params.push(filter.sectorId);
    }

    // Filtrado condicional por estado (solo cuando se solicita explícitamente)
    if (
      filter?.estado !== undefined &&
      filter.estado !== null &&
      String(filter.estado).trim() !== ''
    ) {
      const estadoUpper = String(filter.estado).trim().toUpperCase();
      if (
        estadoUpper === 'NO_ASIGNADA' ||
        estadoUpper === 'SIN_ASIGNAR' ||
        estadoUpper === 'UNASSIGNED'
      ) {
        conditions.push(`ar.id_asignacion IS NULL`);
      } else if (estadoUpper === 'TODOS' || estadoUpper === 'ALL') {
        // No se restringe por estado
      } else if (estadoUpper === 'ACTIVO' || estadoUpper === 'ACTIVA') {
        if (filter?.activa === undefined || filter?.activa === null) {
          conditions.push(`r.activa = true`);
        }
      } else if (estadoUpper === 'EN_CURSO') {
        conditions.push(`ar.estado = $${pIdx++}`);
        params.push('EN_PROCESO');
      } else {
        conditions.push(`ar.estado = $${pIdx++}`);
        params.push(estadoUpper);
      }
    }

    const whereClause = conditions.join(' AND ');

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
                      'codigoRuta', r.codigo,
                      'nombre', r.nombre,
                      'nombreRuta', r.nombre,
                      'descripcion', r.descripcion,
                      'sectorId', r.sector_id,
                      'sector', r.sector_id,
                      'zonaId', r.zona_id,
                      'cantidadAcometidas', r.cantidad_acometidas,
                      'tiempoEstimadoHoras', r.tiempo_estimado_horas::float,
                      'esRural', r.es_rural,
                      'activa', r.activa,
                      'colorBase', r.color_identificador,
                      'estaAsignada', (ar.id_asignacion IS NOT NULL),
                      'idAsignacion', ar.id_asignacion,
                      'estado', COALESCE(ar.estado, 'NO_ASIGNADA'),
                      'periodo', ar.periodo_mes,
                      'fechaProgramada', ar.fecha_programada,
                      'fechaInicio', ar.fecha_inicio,
                      'fechaFin', ar.fecha_fin,
                      'idUsuarioAsignado', ar.usuario_id,
                      'usuario', u.username,
                      'nombreUsuario', COALESCE(TRIM(e.nombres || ' ' || e.apellidos), u.username, NULL),
                      'observacionSupervisor', ar.observacion_supervisor,
                      'lecturasEsperadas', COALESCE(ar.lecturas_esperadas, r.cantidad_acometidas, 0),
                      'lecturasCompletadas', COALESCE(ar.lecturas_completadas, 0),
                      'lecturasPendientes', COALESCE(ar.lecturas_pendientes, 0),
                      'lecturasNovedad', COALESCE(ar.lecturas_novedad, 0),
                      'porcentajeAvance', CASE 
                        WHEN COALESCE(ar.lecturas_esperadas, 0) > 0 THEN 
                          ROUND(((ar.lecturas_completadas + COALESCE(ar.lecturas_novedad, 0))::numeric / ar.lecturas_esperadas::numeric) * 100, 1)::float
                        ELSE 0.0
                      END,
                      'color', CASE 
                        WHEN ar.id_asignacion IS NULL OR ar.estado IS NULL OR ar.estado = 'NO_ASIGNADA' THEN COALESCE(r.color_identificador, '#64748b')
                        WHEN ar.estado = 'EN_PROCESO' THEN '#f59e0b'
                        WHEN ar.estado = 'ASIGNADA' THEN '#2563eb'
                        WHEN ar.estado = 'COMPLETADA' THEN '#10b981'
                        WHEN ar.estado = 'PAUSADA' THEN '#ef4444'
                        WHEN ar.estado = 'REASIGNADA' THEN '#8b5cf6'
                        ELSE COALESCE(r.color_identificador, '#3b82f6')
                      END,
                      'stroke', CASE 
                        WHEN ar.id_asignacion IS NULL OR ar.estado IS NULL OR ar.estado = 'NO_ASIGNADA' THEN COALESCE(r.color_identificador, '#64748b')
                        WHEN ar.estado = 'EN_PROCESO' THEN '#f59e0b'
                        WHEN ar.estado = 'ASIGNADA' THEN '#2563eb'
                        WHEN ar.estado = 'COMPLETADA' THEN '#10b981'
                        WHEN ar.estado = 'PAUSADA' THEN '#ef4444'
                        WHEN ar.estado = 'REASIGNADA' THEN '#8b5cf6'
                        ELSE COALESCE(r.color_identificador, '#3b82f6')
                      END,
                      'strokeColor', CASE 
                        WHEN ar.id_asignacion IS NULL OR ar.estado IS NULL OR ar.estado = 'NO_ASIGNADA' THEN COALESCE(r.color_identificador, '#64748b')
                        WHEN ar.estado = 'EN_PROCESO' THEN '#f59e0b'
                        WHEN ar.estado = 'ASIGNADA' THEN '#2563eb'
                        WHEN ar.estado = 'COMPLETADA' THEN '#10b981'
                        WHEN ar.estado = 'PAUSADA' THEN '#ef4444'
                        WHEN ar.estado = 'REASIGNADA' THEN '#8b5cf6'
                        ELSE COALESCE(r.color_identificador, '#3b82f6')
                      END,
                      'fill', CASE 
                        WHEN ar.id_asignacion IS NULL OR ar.estado IS NULL OR ar.estado = 'NO_ASIGNADA' THEN COALESCE(r.color_identificador, '#64748b')
                        WHEN ar.estado = 'EN_PROCESO' THEN '#f59e0b'
                        WHEN ar.estado = 'ASIGNADA' THEN '#2563eb'
                        WHEN ar.estado = 'COMPLETADA' THEN '#10b981'
                        WHEN ar.estado = 'PAUSADA' THEN '#ef4444'
                        WHEN ar.estado = 'REASIGNADA' THEN '#8b5cf6'
                        ELSE COALESCE(r.color_identificador, '#3b82f6')
                      END,
                      'fillColor', CASE 
                        WHEN ar.id_asignacion IS NULL OR ar.estado IS NULL OR ar.estado = 'NO_ASIGNADA' THEN COALESCE(r.color_identificador, '#64748b')
                        WHEN ar.estado = 'EN_PROCESO' THEN '#f59e0b'
                        WHEN ar.estado = 'ASIGNADA' THEN '#2563eb'
                        WHEN ar.estado = 'COMPLETADA' THEN '#10b981'
                        WHEN ar.estado = 'PAUSADA' THEN '#ef4444'
                        WHEN ar.estado = 'REASIGNADA' THEN '#8b5cf6'
                        ELSE COALESCE(r.color_identificador, '#3b82f6')
                      END,
                      'fill-opacity', CASE 
                        WHEN ar.id_asignacion IS NULL OR ar.estado IS NULL THEN 0.15
                        WHEN ar.estado = 'EN_PROCESO' THEN 0.35
                        WHEN ar.estado = 'PAUSADA' THEN 0.35
                        WHEN ar.estado = 'COMPLETADA' THEN 0.28
                        ELSE 0.25
                      END,
                      'fillOpacity', CASE 
                        WHEN ar.id_asignacion IS NULL OR ar.estado IS NULL THEN 0.15
                        WHEN ar.estado = 'EN_PROCESO' THEN 0.35
                        WHEN ar.estado = 'PAUSADA' THEN 0.35
                        WHEN ar.estado = 'COMPLETADA' THEN 0.28
                        ELSE 0.25
                      END,
                      'stroke-width', CASE WHEN ar.estado = 'EN_PROCESO' THEN 3 ELSE 2 END,
                      'strokeWeight', CASE WHEN ar.estado = 'EN_PROCESO' THEN 3 ELSE 2 END
                  )
              )
          ), '[]'::json)
      ) AS geojson
      FROM public.ruta_lectura r
      ${joinAssignment}
      LEFT JOIN public.usuarios u ON ar.usuario_id = u.usuario_id
      LEFT JOIN public.empleados e ON e.usuario_id = u.usuario_id
      WHERE ${whereClause};
    `;

    const rows = await this.databaseService.query<{ geojson: any }>(
      query,
      params,
    );

    return rows[0]?.geojson || { type: 'FeatureCollection', features: [] };
  }

  async getCentroidsGeoJson(
    filter?: boolean | RouteGeoJsonFilter,
  ): Promise<any> {
    const conditions: string[] = ['r.poligono IS NOT NULL'];
    const params: any[] = [];

    const isBooleanFilter = typeof filter === 'boolean';
    const activaFilter = isBooleanFilter
      ? filter
      : (filter?.activa ?? filter?.activaOnly ?? true);

    if (activaFilter !== undefined && activaFilter !== null) {
      params.push(activaFilter);
      conditions.push(`r.activa = $${params.length}::BOOLEAN`);
    }

    const sectorId = !isBooleanFilter ? filter?.sectorId : undefined;
    if (sectorId !== undefined && sectorId !== null) {
      params.push(sectorId);
      conditions.push(`r.sector_id = $${params.length}::INTEGER`);
    }

    const periodo = !isBooleanFilter ? filter?.periodo : undefined;
    let joinAssignment = `
      LEFT JOIN LATERAL (
        SELECT ar.*
        FROM public.asignacion_ruta ar
        WHERE ar.ruta_id = r.id_ruta
    `;

    if (periodo) {
      params.push(periodo);
      joinAssignment += ` AND ar.periodo_mes = $${params.length}`;
    }

    joinAssignment += `
        ORDER BY ar.created_at DESC
        LIMIT 1
      ) ar ON true
    `;

    const estado = !isBooleanFilter ? filter?.estado : undefined;
    if (estado) {
      if (estado === 'NO_ASIGNADA' || estado === 'SIN_ASIGNAR') {
        conditions.push(`(ar.id_asignacion IS NULL OR ar.estado = 'NO_ASIGNADA')`);
      } else {
        params.push(estado);
        conditions.push(`ar.estado = $${params.length}`);
      }
    }

    const whereClause = conditions.join(' AND ');

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
                      'codigoRuta', r.codigo,
                      'nombre', r.nombre,
                      'nombreRuta', r.nombre,
                      'sectorId', r.sector_id,
                      'sector', r.sector_id,
                      'acometidas', r.cantidad_acometidas,
                      'cantidadAcometidas', r.cantidad_acometidas,
                      'latitud', ROUND(ST_Y(ST_Centroid(r.poligono))::numeric, 6)::double precision,
                      'longitud', ROUND(ST_X(ST_Centroid(r.poligono))::numeric, 6)::double precision,
                      'title', '#' || r.id_ruta || ' | ' || r.codigo,
                      'activa', r.activa,
                      'colorBase', r.color_identificador,
                      'estaAsignada', (ar.id_asignacion IS NOT NULL),
                      'idAsignacion', ar.id_asignacion,
                      'estado', COALESCE(ar.estado, 'NO_ASIGNADA'),
                      'periodo', ar.periodo_mes,
                      'fechaProgramada', ar.fecha_programada,
                      'fechaInicio', ar.fecha_inicio,
                      'fechaFin', ar.fecha_fin,
                      'idUsuarioAsignado', ar.usuario_id,
                      'usuario', u.username,
                      'nombreUsuario', TRIM(CONCAT(e.nombres, ' ', e.apellidos)),
                      'lecturasEsperadas', COALESCE(ar.lecturas_esperadas, r.cantidad_acometidas),
                      'lecturasCompletadas', COALESCE(ar.lecturas_completadas, 0),
                      'lecturasPendientes', COALESCE(ar.lecturas_pendientes, r.cantidad_acometidas),
                      'lecturasNovedad', COALESCE(ar.lecturas_novedad, 0),
                      'porcentajeAvance', CASE 
                        WHEN COALESCE(ar.lecturas_esperadas, r.cantidad_acometidas, 0) > 0 
                        THEN ROUND((COALESCE(ar.lecturas_completadas, 0)::numeric / GREATEST(COALESCE(ar.lecturas_esperadas, r.cantidad_acometidas, 1), 1)::numeric) * 100, 1)::double precision
                        ELSE 0.0
                      END,
                      'marker-color', CASE 
                        WHEN ar.id_asignacion IS NULL OR ar.estado IS NULL OR ar.estado = 'NO_ASIGNADA' THEN COALESCE(r.color_identificador, '#64748b')
                        WHEN ar.estado = 'EN_PROCESO' THEN '#f59e0b'
                        WHEN ar.estado = 'ASIGNADA' THEN '#2563eb'
                        WHEN ar.estado = 'COMPLETADA' THEN '#10b981'
                        WHEN ar.estado = 'PAUSADA' THEN '#ef4444'
                        WHEN ar.estado = 'REASIGNADA' THEN '#8b5cf6'
                        ELSE COALESCE(r.color_identificador, '#3b82f6')
                      END,
                      'color', CASE 
                        WHEN ar.id_asignacion IS NULL OR ar.estado IS NULL OR ar.estado = 'NO_ASIGNADA' THEN COALESCE(r.color_identificador, '#64748b')
                        WHEN ar.estado = 'EN_PROCESO' THEN '#f59e0b'
                        WHEN ar.estado = 'ASIGNADA' THEN '#2563eb'
                        WHEN ar.estado = 'COMPLETADA' THEN '#10b981'
                        WHEN ar.estado = 'PAUSADA' THEN '#ef4444'
                        WHEN ar.estado = 'REASIGNADA' THEN '#8b5cf6'
                        ELSE COALESCE(r.color_identificador, '#3b82f6')
                      END,
                      'marker-size', 'medium'
                  )
              )
          ), '[]'::json)
      ) AS geojson
      FROM public.ruta_lectura r
      ${joinAssignment}
      LEFT JOIN public.usuarios u ON ar.usuario_id = u.usuario_id
      LEFT JOIN public.empleados e ON e.usuario_id = u.usuario_id
      WHERE ${whereClause};
    `;

    const rows = await this.databaseService.query<{ geojson: any }>(
      query,
      params,
    );

    return rows[0]?.geojson || { type: 'FeatureCollection', features: [] };
  }

  async getRouteConnections(idRuta: number): Promise<RouteConnectionModel[]> {
    const query = /*sql*/ `
      SELECT
          ra.id_ruta_acometida AS "id_ruta_acometida",
          ra.ruta_id AS "ruta_id",
          ra.acometida_id AS "acometida_id",
          ra.orden_secuencia AS "orden_secuencia",
          ra.lado_calle AS "lado_calle",
          ra.piso_departamento AS "piso_departamento",
          ra.instruccion_acceso AS "instruccion_acceso",
          ra.activo,
          a.sector AS "sector",
          a.cuenta,
          a.numero_medidor AS "numero_medidor",
          COALESCE(TRIM(ci.nombres || ' ' || ci.apellidos), e.razon_social, 'SIN NOMBRE') AS "abonado",
          a.cliente_id AS "cliente_id",
          a.direccion,
          a.referencia,
          ROUND(ST_Y(COALESCE(a.ubicacion_ruta, a.coordenadas))::numeric, 6)::double precision AS "latitud",
          ROUND(ST_X(COALESCE(a.ubicacion_ruta, a.coordenadas))::numeric, 6)::double precision AS "longitud",
          cp.average_consumption AS "consumo_promedio"
      FROM public.ruta_acometida ra
      JOIN public.acometida a ON ra.acometida_id = a.acometida_id
      INNER JOIN public.consumo_promedio cp ON cp.acometida_id = a.acometida_id
      LEFT JOIN public.cliente c ON a.cliente_id = c.cliente_id
      LEFT JOIN public.ciudadano ci ON ci.ciudadano_id = c.cliente_id
      LEFT JOIN public.empresa e ON e.ruc = c.cliente_id
      WHERE ra.ruta_id = $1 AND ra.activo = TRUE
      ORDER BY ra.orden_secuencia ASC;
    `;

    const rows = await this.databaseService.query<RouteConnectionSqlResult>(
      query,
      [idRuta],
    );
    if (!rows || rows.length === 0) {
      return [];
    }
    return rows.map(ReadingRouteAdapters.toRouteConnectionSqlResult);
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
