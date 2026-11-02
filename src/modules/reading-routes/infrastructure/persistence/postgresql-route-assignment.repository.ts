import { Injectable, Logger } from '@nestjs/common';
import {
  DatabaseAbstract,
  IDatabaseClient,
} from '../../../../shared/connections/database/abstract/abstract.database';
import {
  BatchDispatchSummaryResult,
  IRouteAssignmentRepository,
  ReassignSegmentResult,
  SyncBatchReadingInput,
  SyncBatchResult,
} from '../../domain/contracts/route-assignment.repository.interface';
import { RouteAssignmentEntity } from '../../domain/entities/route-assignment.entity';

@Injectable()
export class PostgresqlRouteAssignmentRepository implements IRouteAssignmentRepository {
  private readonly logger = new Logger(
    PostgresqlRouteAssignmentRepository.name,
  );

  constructor(private readonly databaseService: DatabaseAbstract) {}

  async executeMorningBatchDispatch(
    sectorId: number | null,
    periodoMes: string,
    fechaProgramada: Date,
    lecturistaIds: string[],
    supervisorId: string,
  ): Promise<BatchDispatchSummaryResult> {
    const formattedDate = fechaProgramada.toISOString().split('T')[0];

    // Procedimiento almacenado pr_despacho_masivo_matutino
    const callSql = `
      CALL public.pr_despacho_masivo_matutino(
        $1::integer,
        $2::varchar,
        $3::date,
        $4::uuid[],
        $5::uuid
      );
    `;

    await this.databaseService.query(callSql, [
      sectorId,
      periodoMes,
      formattedDate,
      lecturistaIds,
      supervisorId,
    ]);

    // Resumen de asignaciones generadas conforme a asignacion_ruta
    const summaryQuery = `
      SELECT 
          ar.id_asignacion AS "idAsignacion",
          rl.codigo AS "codigoRuta",
          ar.usuario_id AS "lecturistaId",
          ar.lecturas_esperadas AS "totalPredios"
      FROM public.asignacion_ruta ar
      JOIN public.ruta_lectura rl ON ar.ruta_id = rl.id_ruta
      WHERE ar.periodo_mes = $1
        AND ar.fecha_programada = $2::date
        AND ($3::INTEGER IS NULL OR rl.sector_id = $3::INTEGER)
      ORDER BY ar.id_asignacion ASC;
    `;

    const dispatched = await this.databaseService.query<any>(summaryQuery, [
      periodoMes,
      formattedDate,
      sectorId,
    ]);

    const totalRutasAsignadas = dispatched.length;
    const totalAcometidasDespachadas = dispatched.reduce(
      (acc, curr) => acc + Number(curr.totalPredios || 0),
      0,
    );

    return {
      success: true,
      message: `Despacho matutino ejecutado exitosamente para ${totalRutasAsignadas} rutas.`,
      periodo: periodoMes,
      totalRutasAsignadas,
      totalAcometidasDespachadas,
      rutasDespachadas: dispatched.map((d) => ({
        idAsignacion: Number(d.idAsignacion),
        codigoRuta: d.codigoRuta,
        lecturistaId: d.lecturistaId,
        totalPredios: Number(d.totalPredios),
      })),
    };
  }

  async assignSingleRoute(
    rutaId: number,
    usuarioId: string,
    periodoMes: string,
    fechaProgramada: Date,
    supervisorId: string,
  ): Promise<number> {
    const formattedDate = fechaProgramada.toISOString().split('T')[0];

    const query = `
      SELECT public.fn_despachar_ruta_periodo(
          $1::integer,
          $2::uuid,
          $3::varchar,
          $4::date,
          $5::uuid
      ) AS "idAsignacion";
    `;

    const rows = await this.databaseService.query<{
      idAsignacion: string | number;
    }>(query, [rutaId, usuarioId, periodoMes, formattedDate, supervisorId]);

    return Number(rows[0]?.idAsignacion);
  }

  async reassignRouteSegment(
    asignacionOrigenId: number,
    nuevoUsuarioId: string,
    motivo: string,
    supervisorId: string,
  ): Promise<ReassignSegmentResult> {
    const query = `
      SELECT public.fn_reasignar_segmento_ruta(
          $1::bigint,
          $2::uuid,
          $3::text,
          $4::uuid
      ) AS "nuevaAsignacionId";
    `;

    const rows = await this.databaseService.query<{
      nuevaAsignacionId: string | number;
    }>(query, [asignacionOrigenId, nuevoUsuarioId, motivo, supervisorId]);

    const nuevaAsignacionId = Number(rows[0]?.nuevaAsignacionId);

    const countQuery = `
      SELECT lecturas_esperadas AS "totalPredios"
      FROM public.asignacion_ruta
      WHERE id_asignacion = $1;
    `;
    const countRows = await this.databaseService.query<{
      totalPredios: number;
    }>(countQuery, [nuevaAsignacionId]);
    const prediosTransferidos = Number(countRows[0]?.totalPredios || 0);

    return {
      success: true,
      nuevaAsignacionId,
      asignacionOrigenId,
      prediosTransferidos,
      message: `Segmento pendiente reasignado exitosamente (${prediosTransferidos} predios transferidos).`,
    };
  }

  async getLiveTracking(
    periodoMes?: string,
    fecha?: string,
  ): Promise<RouteAssignmentEntity[]> {
    const conditions: string[] = ['1=1'];
    const params: any[] = [];
    let pIdx = 1;

    if (periodoMes) {
      conditions.push(`ar.periodo_mes = $${pIdx++}`);
      params.push(periodoMes);
    }

    if (fecha) {
      conditions.push(`ar.fecha_programada = $${pIdx++}::date`);
      params.push(fecha);
    }

    const query = `
      SELECT 
          ar.id_asignacion AS "idAsignacion",
          ar.ruta_id AS "rutaId",
          rl.codigo AS "codigoRuta",
          rl.nombre AS "nombreRuta",
          rl.sector_id AS "sector",
          ar.usuario_id AS "usuarioId",
          ar.usuario_id AS "lecturistaId",
          COALESCE(
              NULLIF(TRIM(CONCAT(e.nombres, ' ', e.apellidos)), ''),
              u.username,
              'Operador en campo'
          ) AS "nombreLecturista",
          ar.periodo_mes AS "periodoMes",
          ar.fecha_programada AS "fechaProgramada",
          ar.fecha_inicio AS "fechaInicio",
          ar.fecha_fin AS "fechaCierre",
          ar.estado,
          ar.lecturas_esperadas AS "totalPredios",
          ar.lecturas_esperadas AS "lecturasEsperadas",
          ar.lecturas_completadas AS "prediosLeidos",
          ar.lecturas_completadas AS "lecturasCompletadas",
          ar.lecturas_novedad AS "prediosConNovedad",
          ar.lecturas_novedad AS "lecturasNovedad",
          ar.lecturas_pendientes AS "prediosPendientes",
          ar.lecturas_pendientes AS "lecturasPendientes",
          CASE 
              WHEN ar.lecturas_esperadas > 0 
              THEN ROUND((ar.lecturas_completadas + ar.lecturas_novedad)::numeric / ar.lecturas_esperadas::numeric * 100, 2)::float
              ELSE 0.00
          END AS "porcentajeAvance",
          (ar.estado = 'REASIGNADA') AS "esReasignacion",
          ar.observacion_supervisor AS "motivoReasignacion",
          ar.created_at AS "createdAt",
          ar.updated_at AS "updatedAt"
      FROM public.asignacion_ruta ar
      JOIN public.ruta_lectura rl ON ar.ruta_id = rl.id_ruta
      LEFT JOIN public.usuarios u ON ar.usuario_id = u.usuario_id
      LEFT JOIN public.empleados e ON ar.usuario_id = e.usuario_id
      WHERE ${conditions.join(' AND ')}
      ORDER BY ar.fecha_programada DESC, ar.id_asignacion DESC;
    `;

    const rows = await this.databaseService.query<any>(query, params);
    return rows.map((r) => new RouteAssignmentEntity(r));
  }

  async cancelAssignment(
    idAsignacion: number,
    motivo?: string,
    supervisorId?: string,
  ): Promise<boolean> {
    const query = `
      UPDATE public.asignacion_ruta
      SET estado = 'PAUSADA',
          observacion_supervisor = COALESCE($2, observacion_supervisor),
          updated_at = NOW()
      WHERE id_asignacion = $1 AND estado IN ('ASIGNADA', 'EN_PROCESO', 'PAUSADA');
    `;

    const result = await this.databaseService.execute(query, [
      idAsignacion,
      motivo ?? 'Pausa manual por supervisor',
    ]);

    return result.affectedRows > 0;
  }

  async resumeAssignment(
    idAsignacion: number,
    motivo?: string,
    supervisorId?: string,
  ): Promise<{
    success: boolean;
    idAsignacion: number;
    nuevoEstado: string;
    message: string;
  }> {
    const query = `
      SELECT public.fn_reanudar_asignacion_ruta(
          $1::bigint,
          $2::text,
          $3::uuid
      ) AS result;
    `;

    const rows = await this.databaseService.query<{
      result: {
        success: boolean;
        idAsignacion: number;
        estadoAnterior: string;
        nuevoEstado: string;
        message: string;
      };
    }>(query, [idAsignacion, motivo ?? null, supervisorId ?? null]);

    const res = rows[0]?.result;
    return {
      success: res?.success ?? true,
      idAsignacion: Number(res?.idAsignacion ?? idAsignacion),
      nuevoEstado: res?.nuevoEstado ?? 'EN_PROCESO',
      message:
        res?.message ?? `Asignación ${idAsignacion} reactivada correctamente.`,
    };
  }

  async getMobileWorkPack(idAsignacion: number): Promise<any> {
    const query = /*sql*/ `
      SELECT
          ar.id_asignacion AS "idAsignacion",
          ar.periodo_mes AS "periodo",
          ar.fecha_programada AS "fechaProgramada",
          ar.estado AS "estadoAsignacion",
          ar.lecturas_esperadas AS "totalPredios",
          ar.lecturas_completadas AS "prediosLeidos",
          ar.lecturas_novedad AS "prediosConNovedad",
          ar.lecturas_pendientes AS "prediosPendientes",
          CASE
              WHEN ar.lecturas_esperadas > 0
              THEN ROUND((ar.lecturas_completadas + ar.lecturas_novedad)::numeric / ar.lecturas_esperadas::numeric * 100, 2)::float
              ELSE 0.00
          END AS "porcentajeAvance",
          rl.id_ruta AS "idRuta",
          rl.codigo AS "codigoRuta",
          rl.nombre AS "nombreRuta",
          COALESCE(json_agg(
              json_build_object(
                  'idDetalle', dar.id_detalle,
                  'acometidaId', a.acometida_id,
                  'orden', dar.orden_secuencia,
                  'cuenta', a.cuenta,
                  'numeroMedidor', a.numero_medidor,
                  'abonado', COALESCE(TRIM(ci.nombres || ' ' || ci.apellidos), em.razon_social, 'SIN NOMBRE'),
                  'direccion', a.direccion,
                  'referencia', a.referencia,
                  'latitud', ROUND(ST_Y(COALESCE(a.ubicacion_ruta, a.coordenadas))::numeric, 6),
                  'longitud', ROUND(ST_X(COALESCE(a.ubicacion_ruta, a.coordenadas))::numeric, 6),
                  'ladoCalle', ra.lado_calle,
                  'pisoDepartamento', ra.piso_departamento,
                  'instruccionAcceso', ra.instruccion_acceso,
                  'lecturaAnterior', ult_lec.lectura_actual,
                  'consumoPromedio', cp.average_consumption,
                  'estado', dar.estado_lectura
              ) ORDER BY dar.orden_secuencia ASC
          ) FILTER (WHERE dar.id_detalle IS NOT NULL), '[]'::json) AS acometidas
      FROM public.asignacion_ruta ar
      JOIN public.ruta_lectura rl ON ar.ruta_id = rl.id_ruta
      LEFT JOIN public.detalle_avance_ruta dar ON ar.id_asignacion = dar.asignacion_id
      LEFT JOIN public.acometida a ON dar.acometida_id = a.acometida_id
      INNER JOIN public.consumo_promedio cp ON cp.acometida_id = a.acometida_id
      LEFT JOIN public.ruta_acometida ra ON (ra.ruta_id = ar.ruta_id AND ra.acometida_id = a.acometida_id)
      LEFT JOIN public.cliente cl ON a.cliente_id = cl.cliente_id
      LEFT JOIN public.ciudadano ci ON ci.ciudadano_id = cl.cliente_id
      LEFT JOIN public.empresa em ON em.ruc = cl.cliente_id
      LEFT JOIN LATERAL (
          SELECT l.lectura_actual 
          FROM public.lectura l 
          WHERE l.acometida_id = a.acometida_id 
          ORDER BY l.fecha_lectura DESC 
          LIMIT 1
      ) ult_lec ON TRUE
      WHERE ar.id_asignacion = $1
      GROUP BY ar.id_asignacion, ar.periodo_mes, ar.fecha_programada, ar.estado, ar.lecturas_esperadas, ar.lecturas_completadas, ar.lecturas_novedad, ar.lecturas_pendientes, rl.id_ruta, rl.codigo, rl.nombre;
    `;

    const rows = await this.databaseService.query<any>(query, [idAsignacion]);
    if (!rows || rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  async syncMobileReadingsBatch(
    asignacionId: number,
    lecturas: SyncBatchReadingInput[],
    usuarioId: string,
  ): Promise<SyncBatchResult> {
    let totalExitosos = 0;
    let totalFallidos = 0;
    const errores: Array<{
      idDetalleAvance: number;
      acometidaId: string;
      error: string;
    }> = [];

    // Validar asignación
    const assignRows = await this.databaseService.query<any>(
      `SELECT id_asignacion, estado, periodo_mes FROM public.asignacion_ruta WHERE id_asignacion = $1;`,
      [asignacionId],
    );

    if (!assignRows || assignRows.length === 0) {
      return {
        success: false,
        totalSincronizados: 0,
        totalExitosos: 0,
        totalFallidos: lecturas.length,
        errores: [
          {
            idDetalleAvance: 0,
            acometidaId: '',
            error: `Asignación ${asignacionId} no encontrada.`,
          },
        ],
      };
    }

    const periodoMes = assignRows[0].periodo_mes;

    await this.databaseService.transaction(async (client: IDatabaseClient) => {
      for (const item of lecturas) {
        try {
          const detailRows = await client.query<any>(
            `SELECT id_detalle, acometida_id, estado_lectura FROM public.detalle_avance_ruta WHERE id_detalle = $1 AND asignacion_id = $2;`,
            [item.idDetalleAvance, asignacionId],
          );

          if (!detailRows || detailRows.length === 0) {
            throw new Error(
              `Detalle de avance ${item.idDetalleAvance} no corresponde a la asignación ${asignacionId}`,
            );
          }

          // Estados válidos según trigger trg_actualizar_progreso_asignacion: 'LEIDA', 'NOVEDAD', 'PENDIENTE', 'SALTADA'
          const nuevoEstado = item.novedadId ? 'NOVEDAD' : 'LEIDA';
          const fechaHora = item.fechaHoraCaptura
            ? new Date(item.fechaHoraCaptura)
            : new Date();

          // 1. Registrar lectura
          const lecturaQuery = `
            INSERT INTO public.lectura (
              acometida_id,
              lectura_actual,
              fecha_lectura,
              hora_lectura,
              novedad,
              ubicacion_captura,
              mes_lectura
            ) VALUES (
              $1,
              $2,
              $3::date,
              $4::time,
              $5,
              CASE WHEN $6::numeric IS NOT NULL AND $7::numeric IS NOT NULL 
                   THEN ST_SetSRID(ST_Point($7, $6), 4326) 
                   ELSE NULL END,
              $8
            )
            RETURNING lectura_id AS "lecturaId";
          `;

          const horaFormatted = fechaHora.toTimeString().split(' ')[0];
          const fechaFormatted = fechaHora.toISOString().split('T')[0];

          const lecResult = await client.query<{ lecturaId: number }>(
            lecturaQuery,
            [
              item.acometidaId,
              item.lecturaActual,
              fechaFormatted,
              horaFormatted,
              item.novedadId ?? null,
              item.latitudGps ?? null,
              item.longitudGps ?? null,
              periodoMes,
            ],
          );

          const lecturaId = lecResult[0]?.lecturaId ?? null;

          // 2. Actualizar detalle_avance_ruta conforme a columnas de ruta_lectura.sql
          // (estado_lectura, lectura_id, coordenadas_captura, fecha_captura, fecha_sincronizacion)
          // Esto dispara automáticamente el trigger trg_detalle_avance_progreso
          const updateDetailSql = `
            UPDATE public.detalle_avance_ruta
            SET estado_lectura = $1,
                lectura_id = $2,
                coordenadas_captura = CASE WHEN $3::numeric IS NOT NULL AND $4::numeric IS NOT NULL 
                                          THEN ST_SetSRID(ST_Point($4, $3), 4326) 
                                          ELSE NULL END,
                fecha_captura = $5,
                fecha_sincronizacion = NOW()
            WHERE id_detalle = $6;
          `;

          await client.query(updateDetailSql, [
            nuevoEstado,
            lecturaId,
            item.latitudGps ?? null,
            item.longitudGps ?? null,
            fechaHora,
            item.idDetalleAvance,
          ]);

          totalExitosos++;
        } catch (err: any) {
          totalFallidos++;
          errores.push({
            idDetalleAvance: item.idDetalleAvance,
            acometidaId: item.acometidaId,
            error: err.message || 'Error desconocido al sincronizar',
          });
        }
      }
    });

    return {
      success: totalFallidos === 0,
      totalSincronizados: lecturas.length,
      totalExitosos,
      totalFallidos,
      errores,
    };
  }

  async getLecturistDailyKpi(usuarioId: string, fecha?: string): Promise<any> {
    const targetDate = fecha || new Date().toISOString().split('T')[0];

    const query = /*sql*/ `
          SELECT 
              ar.usuario_id AS "usuarioId",
              COUNT(ar.id_asignacion)::int AS "rutasAsignadas",
              COALESCE(SUM(ar.lecturas_esperadas), 0)::int AS "totalPrediosAsignados",
              COALESCE(SUM(ar.lecturas_completadas), 0)::int AS "totalPrediosLeidos",
              COALESCE(SUM(ar.lecturas_novedad), 0)::int AS "totalNovedades",
              COALESCE(SUM(ar.lecturas_pendientes), 0)::int AS "totalPendientes",
              CASE 
                  WHEN SUM(ar.lecturas_esperadas) > 0 
                  THEN ROUND((SUM(ar.lecturas_completadas + ar.lecturas_novedad)::numeric / SUM(ar.lecturas_esperadas)::numeric) * 100, 2)
                  ELSE 0.00
              END AS "porcentajeEfectividad",
              MIN(tiempos.hora_primera_lectura) AS "horaPrimeraLectura",
              MAX(tiempos.hora_ultima_lectura) AS "horaUltimaLectura"
          FROM public.asignacion_ruta ar
          LEFT JOIN (
              SELECT 
                  dar.asignacion_id,
                  MIN(dar.fecha_captura) AS hora_primera_lectura,
                  MAX(dar.fecha_captura) AS hora_ultima_lectura
              FROM public.detalle_avance_ruta dar
              WHERE dar.estado_lectura IN ('LEIDA', 'NOVEDAD')
                AND dar.fecha_captura IS NOT NULL
              GROUP BY dar.asignacion_id
          ) tiempos ON ar.id_asignacion = tiempos.asignacion_id
          WHERE ar.usuario_id = $1::uuid
            AND ar.fecha_programada = $2::date
            AND ar.periodo_mes = TO_CHAR($2::date, 'YYYY-MM')
            AND ar.estado IN ('ASIGNADA', 'EN_PROCESO', 'COMPLETADA')
          GROUP BY ar.usuario_id;
    `;

    const rows = await this.databaseService.query<any>(query, [
      usuarioId,
      targetDate,
    ]);

    if (!rows || rows.length === 0) {
      return {
        usuarioId,
        fecha: targetDate,
        rutasAsignadas: 0,
        totalPrediosAsignados: 0,
        totalPrediosLeidos: 0,
        totalNovedades: 0,
        totalPendientes: 0,
        porcentajeEfectividad: 0.0,
        horaPrimeraLectura: null,
        horaUltimaLectura: null,
      };
    }

    return {
      ...rows[0],
      fecha: targetDate,
      porcentajeEfectividad: Number(rows[0].porcentajeEfectividad || 0),
    };
  }
}
