import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { UUID } from 'crypto';
import {
  DatabaseAbstract,
  IDatabaseClient,
} from '../../../../shared/connections/database/abstract/abstract.database';
import {
  AssignmentDetailSyncContext,
  BatchDispatchSummaryResult,
  ExplicitRouteAssignmentInput,
  IRouteAssignmentRepository,
  ReassignSegmentResult,
  SyncBatchReadingInput,
  SyncBatchResult,
  UpdateAdvanceDetailInput,
} from '../../domain/contracts/route-assignment.repository.interface';
import { RouteAssignmentEntity } from '../../domain/entities/route-assignment.entity';
import { CreateReadingUseCase } from '../../../reading/application/usecases/commands/CreateReadingUseCase';
import { CreateReadingRequest } from '../../../reading/application/dtos/request/create-reading.request';
import { AsignacionRutaDetalleSqlResult } from '../interfaces/reading-route.interface';
import { AsignacionRutaDetalleEntity } from '../../domain/entities/reading-route.entity';
import { ReadingRouteAdapters } from '../adapters/reading-route.adapters';

@Injectable()
export class PostgresqlRouteAssignmentRepository implements IRouteAssignmentRepository {
  private readonly logger = new Logger(
    PostgresqlRouteAssignmentRepository.name,
  );
  private resolvedCreateReadingUseCase?: CreateReadingUseCase;

  constructor(
    private readonly databaseService: DatabaseAbstract,
    @Optional() private readonly moduleRef?: ModuleRef,
  ) {}

  private getCreateReadingUseCase(): CreateReadingUseCase | null {
    if (this.resolvedCreateReadingUseCase) {
      return this.resolvedCreateReadingUseCase;
    }
    if (this.moduleRef) {
      try {
        this.resolvedCreateReadingUseCase = this.moduleRef.get(
          CreateReadingUseCase,
          { strict: false },
        );
        return this.resolvedCreateReadingUseCase;
      } catch (err: any) {
        this.logger.debug?.(
          `CreateReadingUseCase no obtenido vía ModuleRef: ${err.message}`,
        );
      }
    }
    return null;
  }

  async executeExplicitBatchDispatch(
    asignaciones: ExplicitRouteAssignmentInput[],
    periodoMes: string,
    fechaProgramada: Date,
    supervisorId: string,
  ): Promise<BatchDispatchSummaryResult> {
    const formattedDate = fechaProgramada.toISOString().split('T')[0];
    const asignacionIds: number[] = [];
    const errorDetails: string[] = [];

    for (const item of asignaciones) {
      const sql = `
        SELECT public.fn_despachar_ruta_periodo(
          $1::integer,
          $2::uuid,
          $3::varchar,
          $4::date,
          $5::uuid
        ) AS id_asignacion;
      `;
      try {
        const res = await this.databaseService.query<{ id_asignacion: string }>(
          sql,
          [
            item.rutaId,
            item.lecturistaId,
            periodoMes,
            formattedDate,
            supervisorId,
          ],
        );
        if (res && res.length > 0 && res[0].id_asignacion) {
          asignacionIds.push(Number(res[0].id_asignacion));
        }
      } catch (err: any) {
        const errorMsg = err?.message || String(err);
        errorDetails.push(`Ruta ${item.rutaId}: ${errorMsg}`);
        this.logger.warn(
          `No se pudo despachar ruta ${item.rutaId} a ${item.lecturistaId}: ${errorMsg}`,
        );
      }
    }

    if (asignacionIds.length === 0) {
      const uniqueErrors = Array.from(new Set(errorDetails));
      const reason = uniqueErrors.length > 0
        ? uniqueErrors.slice(0, 3).join(' | ')
        : 'Verifique los límites de capacidad de los lecturistas o si las rutas ya se encuentran asignadas.';
      throw new BadRequestException(
        `No se pudo despachar ninguna ruta en base de datos. Motivo: ${reason}`,
      );
    }

    const summaryQuery = `
      SELECT 
          ar.id_asignacion AS "idAsignacion",
          rl.codigo AS "codigoRuta",
          ar.usuario_id AS "lecturistaId",
          ar.lecturas_esperadas AS "totalPredios"
      FROM public.asignacion_ruta ar
      JOIN public.ruta_lectura rl ON ar.ruta_id = rl.id_ruta
      WHERE ar.id_asignacion = ANY($1::bigint[])
      ORDER BY ar.id_asignacion ASC;
    `;

    const dispatched = await this.databaseService.query<any>(summaryQuery, [
      asignacionIds,
    ]);

    const totalRutasAsignadas = dispatched.length;
    const totalAcometidasDespachadas = dispatched.reduce(
      (acc, curr) => acc + Number(curr.totalPredios || 0),
      0,
    );

    return {
      success: true,
      message: `Despacho explícito completado exitosamente: ${totalRutasAsignadas} de ${asignaciones.length} rutas despachadas.`,
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

    // Resumen optimizado con predicados dinámicos para índice B-Tree
    const conditions: string[] = [
      'ar.periodo_mes = $1',
      'ar.fecha_programada = $2::date',
    ];
    const params: any[] = [periodoMes, formattedDate];

    if (sectorId !== null && sectorId !== undefined) {
      params.push(sectorId);
      conditions.push(`rl.sector_id = $${params.length}::integer`);
    }

    const summaryQuery = `
      SELECT 
          ar.id_asignacion AS "idAsignacion",
          rl.codigo AS "codigoRuta",
          ar.usuario_id AS "lecturistaId",
          ar.lecturas_esperadas AS "totalPredios"
      FROM public.asignacion_ruta ar
      JOIN public.ruta_lectura rl ON ar.ruta_id = rl.id_ruta
      WHERE ${conditions.join(' AND ')}
      ORDER BY ar.id_asignacion ASC;
    `;

    const dispatched = await this.databaseService.query<any>(summaryQuery, params);

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
          e.ciudadano_id as "identificacionUsuario",
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

  async getMobileWorkPack(
    idAsignacion: number,
  ): Promise<AsignacionRutaDetalleEntity> {
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
                  'clienteId', a.cliente_id,
                  'direccion', a.direccion,
                  'referencia', a.referencia,
                  'latitud', ROUND(ST_Y(COALESCE(a.ubicacion_ruta, a.coordenadas))::numeric, 6),
                  'longitud', ROUND(ST_X(COALESCE(a.ubicacion_ruta, a.coordenadas))::numeric, 6),
                  'ladoCalle', ra.lado_calle,
                  'pisoDepartamento', ra.piso_departamento,
                  'instruccionAcceso', ra.instruccion_acceso,
                  'lecturaAnterior', COALESCE(cur_lec.lectura_anterior, prev_lec.lectura_actual, 0),
                  'consumoPromedio', cp.average_consumption,
                  'estado', dar.estado_lectura,
                  'lecturaActual', cur_lec.lectura_actual,
                  'fechaHoraCaptura', dar.fecha_captura,
                  'tipoNovedadLecturaId', COALESCE(dar.tipo_novedad_lectura_id, cur_lec.tipo_novedad_lectura_id),
                  'estadoLecturaId', COALESCE(dar.estado_lectura_id, cur_lec.lectura_estado_id),
                  'observaciones', COALESCE(dar.observacion, cur_lec.observacion)
              ) ORDER BY dar.orden_secuencia ASC
          ) FILTER (WHERE dar.id_detalle IS NOT NULL), '[]'::json) AS acometidas
      FROM public.asignacion_ruta ar
      JOIN public.ruta_lectura rl ON ar.ruta_id = rl.id_ruta
      LEFT JOIN public.detalle_avance_ruta dar ON ar.id_asignacion = dar.asignacion_id
      LEFT JOIN public.acometida a ON dar.acometida_id = a.acometida_id
      LEFT JOIN public.consumo_promedio cp ON cp.acometida_id = a.acometida_id
      LEFT JOIN public.ruta_acometida ra ON (ra.ruta_id = ar.ruta_id AND ra.acometida_id = a.acometida_id)
      LEFT JOIN public.cliente cl ON a.cliente_id = cl.cliente_id
      LEFT JOIN public.ciudadano ci ON ci.ciudadano_id = cl.cliente_id
      LEFT JOIN public.empresa em ON em.ruc = cl.cliente_id
      LEFT JOIN public.lectura cur_lec ON cur_lec.lectura_id = dar.lectura_id
      LEFT JOIN LATERAL (
          SELECT l.lectura_actual 
          FROM public.lectura l 
          WHERE l.acometida_id = a.acometida_id 
            AND (l.mes_lectura < ar.periodo_mes OR l.mes_lectura IS NULL)
          ORDER BY l.fecha_lectura DESC, l.lectura_id DESC 
          LIMIT 1
      ) prev_lec ON TRUE
      WHERE ar.id_asignacion = $1
      GROUP BY ar.id_asignacion, ar.periodo_mes, ar.fecha_programada, ar.estado, ar.lecturas_esperadas, ar.lecturas_completadas, ar.lecturas_novedad, ar.lecturas_pendientes, rl.id_ruta, rl.codigo, rl.nombre;
    `;

    const rows =
      await this.databaseService.query<AsignacionRutaDetalleSqlResult>(query, [
        idAsignacion,
      ]);
    if (!rows || rows.length === 0) {
      throw new NotFoundException(`Asignación ${idAsignacion} no encontrada.`);
    }

    return ReadingRouteAdapters.fromAsignacionRutaDetalleSqlResultToAsignacionRutaDetalleEntity(
      rows[0],
    );
  }

  async getAssignmentPeriod(
    asignacionId: number,
  ): Promise<{ periodoMes: string; usuarioId: string } | null> {
    const rows = await this.databaseService.query<any>(
      `SELECT id_asignacion, estado, periodo_mes AS "periodoMes", usuario_id AS "usuarioId" 
       FROM public.asignacion_ruta 
       WHERE id_asignacion = $1;`,
      [asignacionId],
    );
    if (!rows || rows.length === 0) return null;
    return rows[0];
  }

  async getAssignmentDetailSyncContext(
    idDetalle: number,
    asignacionId: number,
  ): Promise<AssignmentDetailSyncContext | null> {
    const rows = await this.databaseService.query<any>(
      `SELECT dar.id_detalle AS "idDetalle",
              dar.asignacion_id AS "asignacionId",
              dar.acometida_id AS "acometidaId",
              dar.estado_lectura AS "estadoLectura",
              dar.lectura_id AS "lecturaId",
              COALESCE(
                (SELECT l.codigo_lectura FROM public.lectura l WHERE l.lectura_id = dar.lectura_id),
                (SELECT l.codigo_lectura FROM public.lectura l WHERE l.acometida_id = a.acometida_id AND l.mes_lectura = ar.periodo_mes ORDER BY l.fecha_lectura DESC, l.lectura_id DESC LIMIT 1)
              ) AS "codigoLectura",
              ar.periodo_mes AS "periodoMes",
              ar.usuario_id AS "asignacionUsuarioId",
              a.sector,
              a.cuenta,
              a.clave_catastral AS "claveCatastral",
              COALESCE(
                (SELECT l.lectura_actual 
                 FROM public.lectura l 
                 WHERE l.acometida_id = a.acometida_id 
                   AND (l.mes_lectura < ar.periodo_mes OR l.mes_lectura IS NULL)
                 ORDER BY l.fecha_lectura DESC, l.lectura_id DESC 
                 LIMIT 1), 
                (SELECT l.lectura_actual 
                 FROM public.lectura l 
                 WHERE l.acometida_id = a.acometida_id 
                 ORDER BY l.fecha_lectura DESC, l.lectura_id DESC 
                 LIMIT 1),
                0
              ) AS "lecturaAnterior",
              COALESCE(cp.average_consumption, 0) AS "averageConsumption",
              COALESCE(cp.average_value, 0) AS "averageValue"
       FROM public.detalle_avance_ruta dar
       JOIN public.asignacion_ruta ar ON ar.id_asignacion = dar.asignacion_id
       JOIN public.acometida a ON a.acometida_id = dar.acometida_id
       LEFT JOIN public.consumo_promedio cp ON cp.acometida_id = a.acometida_id
       WHERE dar.id_detalle = $1 AND dar.asignacion_id = $2;`,
      [idDetalle, asignacionId],
    );
    if (!rows || rows.length === 0) return null;
    return rows[0];
  }

  async updateAdvanceDetail(input: UpdateAdvanceDetailInput): Promise<void> {
    const updateDetailSql = `
      UPDATE public.detalle_avance_ruta
      SET estado_lectura = $1::varchar,
          lectura_id = $2::integer,
          tipo_novedad_lectura_id = CASE 
            WHEN $1::varchar = 'NOVEDAD'::varchar THEN (SELECT tipo_novedad_lectura_id FROM public.tipo_novedad_lectura WHERE UPPER(nombre) = UPPER($3) OR tipo_novedad_lectura_id::text = $3 LIMIT 1)
            ELSE $4::integer 
          END,
          coordenadas_captura = CASE WHEN $5::numeric IS NOT NULL AND $6::numeric IS NOT NULL 
                                    THEN ST_SetSRID(ST_Point($6, $5), 4326) 
                                    ELSE NULL END,
          fecha_captura = $7::timestamptz,
          fecha_sincronizacion = NOW()
      WHERE id_detalle = $8::bigint;
    `;

    await this.databaseService.query(updateDetailSql, [
      input.estadoLectura,
      input.lecturaId,
      input.novedad ?? 'NORMAL',
      input.tipoNovedadLecturaId ?? null,
      input.latitudGps ?? null,
      input.longitudGps ?? null,
      input.fechaCaptura ?? new Date(),
      input.idDetalle,
    ]);
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

    const assignmentInfo = await this.getAssignmentPeriod(asignacionId);

    if (!assignmentInfo) {
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

    const periodoMes = assignmentInfo.periodoMes;
    const [year, month] = periodoMes.split('-').map(Number);
    const prevDate = new Date(year, month - 2, 1);
    const previousMonthReading = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;

    const createReadingUseCase = this.getCreateReadingUseCase();

    const isUuid = (val?: string) =>
      !!val &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        val,
      );

    for (const item of lecturas) {
      try {
        const context = await this.getAssignmentDetailSyncContext(
          item.idDetalleAvance,
          asignacionId,
        );

        if (!context) {
          throw new Error(
            `Detalle de avance ${item.idDetalleAvance} no corresponde a la asignación ${asignacionId}`,
          );
        }

        const fechaHora = item.fechaHoraCaptura
          ? new Date(item.fechaHoraCaptura)
          : new Date();
        const horaFormatted = fechaHora.toTimeString().split(' ')[0];

        const isNovedad =
          !!item.novedadId &&
          item.novedadId.trim() !== '' &&
          item.novedadId.toUpperCase() !== 'NORMAL';
        const nuevoEstado = isNovedad ? 'NOVEDAD' : 'LEIDA';

        let lecturaId: number | null = null;
        let tipoNovedadId: number | null = isNovedad ? 2 : 1;

        if (createReadingUseCase) {
          const createReadingRequest: CreateReadingRequest = {
            connectionId: context.acometidaId,
            cadastralKey: context.claveCatastral,
            sector: Number(context.sector),
            account: Number(context.cuenta),
            previousReading: Number(context.lecturaAnterior ?? 0),
            currentReading: Number(item.lecturaActual),
            incomeCode: 0,
            rentalIncomeCode: 0,
            sewerRate: 0,
            readingValue: 0,
            consumptionM3: Math.max(
              0,
              Number(item.lecturaActual) - Number(context.lecturaAnterior ?? 0),
            ),
            totalValue: 0,
            averageConsumption: Number(context.averageConsumption ?? 0),
            averageValue: Number(context.averageValue ?? 0),
            previousMonthReading,
            currentMonthReading: periodoMes,
            novelty: item.novedadId ?? null,
            typeNoveltyReadingId: 1,
            meterStatus: 'BUENO',
            locationCapture:
              item.latitudGps != null && item.longitudGps != null
                ? {
                    lat: Number(item.latitudGps),
                    lng: Number(item.longitudGps),
                  }
                : null,
            readingDate: fechaHora,
            readingTime: horaFormatted,
          };

          const effectiveUserId = (
            isUuid(usuarioId)
              ? usuarioId
              : isUuid(context.asignacionUsuarioId)
                ? context.asignacionUsuarioId
                : '00000000-0000-0000-0000-000000000001'
          ) as UUID;

          const created = await createReadingUseCase.execute(
            createReadingRequest,
            effectiveUserId,
          );
          lecturaId = created?.readingId ?? null;
          tipoNovedadId =
            (created as any)?.typeNoveltyReadingId ?? (isNovedad ? 2 : 1);
        } else {
          // Fallback SQL directo si se ejecuta fuera del contenedor NestJS
          const fechaFormatted = fechaHora.toISOString().split('T')[0];
          const lecturaQuery = `
            INSERT INTO public.lectura (
              acometida_id,
              sector,
              cuenta,
              clave_catastral,
              lectura_anterior,
              lectura_actual,
              fecha_lectura,
              hora_lectura,
              novedad,
              tipo_novedad_lectura_id,
              lectura_estado_id,
              observacion,
              ubicacion_captura,
              mes_lectura
            ) VALUES (
              $1,
              $2,
              $3,
              $4,
              $5,
              $6,
              $7::date,
              $8::time,
              $9,
              COALESCE(
                (SELECT tipo_novedad_lectura_id FROM public.tipo_novedad_lectura 
                 WHERE UPPER(nombre) = UPPER($10) OR tipo_novedad_lectura_id::text = $10 LIMIT 1),
                1
              ),
              $11,
              $12,
              CASE WHEN $13::numeric IS NOT NULL AND $14::numeric IS NOT NULL 
                   THEN ST_SetSRID(ST_Point($14, $13), 4326) 
                   ELSE NULL END,
              $15
            )
            RETURNING lectura_id AS "lecturaId";
          `;

          const lecResult = await this.databaseService.query<{
            lecturaId: number;
          }>(lecturaQuery, [
            item.acometidaId,
            context.sector,
            context.cuenta,
            context.claveCatastral,
            context.lecturaAnterior ?? 0,
            item.lecturaActual,
            fechaFormatted,
            horaFormatted,
            item.novedadId ?? 'LECTURA NORMAL',
            item.novedadId ?? 'NORMAL',
            2,
            item.observaciones ?? item.novedadId ?? 'NORMAL',
            item.latitudGps ?? null,
            item.longitudGps ?? null,
            periodoMes,
          ]);
          lecturaId = lecResult[0]?.lecturaId ?? null;
        }

        await this.updateAdvanceDetail({
          idDetalle: item.idDetalleAvance,
          estadoLectura: nuevoEstado,
          lecturaId,
          latitudGps: item.latitudGps,
          longitudGps: item.longitudGps,
          fechaCaptura: fechaHora,
          novedad: item.novedadId ?? 'NORMAL',
          tipoNovedadLecturaId: tipoNovedadId,
        });

        totalExitosos++;
      } catch (err: any) {
        totalFallidos++;
        this.logger.warn(
          `Error en sincronización de lectura detalle ${item.idDetalleAvance}: ${err.message}`,
        );
        errores.push({
          idDetalleAvance: item.idDetalleAvance,
          acometidaId: item.acometidaId,
          error: err.message || 'Error desconocido al sincronizar',
        });
      }
    }

    return {
      success: totalFallidos === 0,
      totalSincronizados: totalExitosos,
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

  async getAssignedRoutesByLecturist(
    usuarioId: string,
    fecha?: string,
    periodoMes?: string,
  ): Promise<RouteAssignmentEntity[]> {
    const conditions: string[] = ['ar.usuario_id = $1::uuid'];
    const params: (string | number)[] = [usuarioId];
    let pIdx = 2;

    if (fecha) {
      conditions.push(`ar.fecha_programada = $${pIdx++}::date`);
      params.push(fecha);
    }

    if (periodoMes) {
      conditions.push(`ar.periodo_mes = $${pIdx++}`);
      params.push(periodoMes);
    }

    conditions.push(
      `ar.estado IN ('ASIGNADA', 'EN_PROCESO', 'PAUSADA', 'COMPLETADA')`,
    );

    const query = `
      SELECT 
          ar.id_asignacion AS "idAsignacion",
          ar.ruta_id AS "rutaId",
          rl.codigo AS "codigoRuta",
          rl.nombre AS "nombreRuta",
          rl.sector_id AS "sector",
          ar.usuario_id AS "usuarioId",
          e.ciudadano_id AS "identificacionUsuario",
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

    const rows = await this.databaseService.query<
      Partial<RouteAssignmentEntity>
    >(query, params);
    return rows.map((r) => new RouteAssignmentEntity(r));
  }
}
