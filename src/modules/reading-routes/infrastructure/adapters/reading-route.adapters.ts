import {
  AcometidaRutaDetalleEntity,
  AsignacionRutaDetalleEntity,
} from '../../domain/entities/reading-route.entity';
import { RouteConnectionModel } from '../../domain/entities/route-connection.entity';
import {
  AcometidaRutaDetalleSqlResult,
  AsignacionRutaDetalleSqlResult,
  RouteConnectionSqlResult,
} from '../interfaces/reading-route.interface';

export class ReadingRouteAdapters {
  static toRouteConnectionSqlResult(
    model: RouteConnectionSqlResult,
  ): RouteConnectionModel {
    return {
      idRutaAcometida: model.id_ruta_acometida,
      rutaId: model.ruta_id,
      acometidaId: model.acometida_id,
      ordenSecuencia: model.orden_secuencia,
      ladoCalle: model.lado_calle,
      pisoDepartamento: model.piso_departamento,
      instruccionAcceso: model.instruccion_acceso,
      activo: model.activo,
      sector: model.sector,
      cuenta: model.cuenta,
      numeroMedidor: model.numero_medidor,
      abonado: model.abonado,
      clienteId: model.cliente_id,
      direccion: model.direccion,
      referencia: model.referencia,
      latitud: model.latitud,
      longitud: model.longitud,
      consumoPromedio: model.consumo_promedio,
    };
  }

  static fromAcometidaRutaDetalleSqlResultToAcometidaRutaDetalleEntity(
    model: AcometidaRutaDetalleSqlResult,
  ): AcometidaRutaDetalleEntity {
    return {
      idDetalle: Number(model.idDetalle ?? model.id_detalle),
      acometidaId: (model.acometidaId ?? model.acometida_id ?? '').toString(),
      orden: Number(model.orden ?? 0),
      cuenta: model.cuenta != null ? String(model.cuenta) : null,
      numeroMedidor:
        (model.numeroMedidor ?? model.numero_medidor) != null
          ? String(model.numeroMedidor ?? model.numero_medidor)
          : null,
      abonado: model.abonado ?? 'SIN NOMBRE',
      clienteId:
        (model.clienteId ?? model.cliente_id) != null
          ? String(model.clienteId ?? model.cliente_id)
          : null,
      direccion: model.direccion ?? null,
      referencia: model.referencia ?? null,
      latitud:
        model.latitud != null && !isNaN(Number(model.latitud))
          ? Number(model.latitud)
          : null,
      longitud:
        model.longitud != null && !isNaN(Number(model.longitud))
          ? Number(model.longitud)
          : null,
      ladoCalle: model.ladoCalle ?? model.lado_calle ?? null,
      pisoDepartamento:
        model.pisoDepartamento ?? model.piso_departamento ?? null,
      instruccionAcceso:
        model.instruccionAcceso ?? model.instruccion_acceso ?? null,
      lecturaAnterior: Number(
        model.lecturaAnterior ?? model.lectura_anterior ?? 0,
      ),
      consumoPromedio:
        (model.consumoPromedio ?? model.consumo_promedio) != null
          ? Number(model.consumoPromedio ?? model.consumo_promedio)
          : null,
      estado: model.estado ?? 'PENDIENTE',
      lecturaActual:
        (model.lecturaActual ?? model.lectura_actual) != null
          ? Number(model.lecturaActual ?? model.lectura_actual)
          : null,
      fechaHoraCaptura:
        model.fechaHoraCaptura ?? model.fecha_hora_captura ?? null,
      tipoNovedadLecturaId:
        (model.tipoNovedadLecturaId ?? model.tipo_novedad_lectura_id) != null
          ? Number(model.tipoNovedadLecturaId ?? model.tipo_novedad_lectura_id)
          : null,
      estadoLecturaId:
        (model.estadoLecturaId ?? model.estado_lectura_id) != null
          ? Number(model.estadoLecturaId ?? model.estado_lectura_id)
          : null,
      observaciones: model.observaciones ?? null,
    };
  }

  static fromAsignacionRutaDetalleSqlResultToAsignacionRutaDetalleEntity(
    models: AsignacionRutaDetalleSqlResult,
  ): AsignacionRutaDetalleEntity {
    return {
      idAsignacion: Number(models.idAsignacion ?? models.id_asignacion),
      periodo: models.periodo,
      fechaProgramada:
        models.fechaProgramada ?? models.fecha_programada ?? null,
      estadoAsignacion: models.estadoAsignacion ?? models.estado_asignacion ?? 'ASIGNADA',
      totalPredios: Number(models.totalPredios ?? models.total_predios ?? 0),
      prediosLeidos: Number(models.prediosLeidos ?? models.predios_leidos ?? 0),
      prediosConNovedad: Number(
        models.prediosConNovedad ?? models.predios_con_novedad ?? 0,
      ),
      prediosPendientes: Number(
        models.prediosPendientes ?? models.predios_pendientes ?? 0,
      ),
      porcentajeAvance: Number(
        models.porcentajeAvance ?? models.porcentaje_avance ?? 0,
      ),
      idRuta: Number(models.idRuta ?? models.id_ruta),
      codigoRuta: models.codigoRuta ?? models.codigo_ruta ?? '',
      nombreRuta: models.nombreRuta ?? models.nombre_ruta ?? '',
      acometidas: (models.acometidas || []).map((acometida) =>
        this.fromAcometidaRutaDetalleSqlResultToAcometidaRutaDetalleEntity(
          acometida,
        ),
      ),
    };
  }

  static fromListAsignacionRutaDetalleSqlResult(
    model: AsignacionRutaDetalleSqlResult[],
  ): AsignacionRutaDetalleEntity[] {
    return model.map((m) =>
      this.fromAsignacionRutaDetalleSqlResultToAsignacionRutaDetalleEntity(m),
    );
  }
}
