import { RouteConnectionModel } from '../../domain/entities/route-connection.entity';
import {
  AcometidaRutaDetalle,
  AsignacionRutaDetalle,
  RouteConnectionResponse,
} from '../dtos/response/route-dtos.response';
import {
  AcometidaRutaDetalleEntity,
  AsignacionRutaDetalleEntity,
} from '../../domain/entities/reading-route.entity';

export class ReadingRoutesMapper {
  static toRouteConnectionResponse(
    model: RouteConnectionModel,
  ): RouteConnectionResponse {
    return {
      idRutaAcometida: model.idRutaAcometida,
      rutaId: model.rutaId,
      acometidaId: model.acometidaId,
      ordenSecuencia: model.ordenSecuencia,
      ladoCalle: model.ladoCalle,
      instruccionAcceso: model.instruccionAcceso,
      activo: model.activo,
      sector: model.sector,
      cuenta: model.cuenta,
      numeroMedidor: model.numeroMedidor,
      abonado: model.abonado,
      clienteId: model.clienteId,
      direccion: model.direccion,
      referencia: model.referencia,
      latitud: model.latitud,
      longitud: model.longitud,
      consumoPromedio: model.consumoPromedio,
    };
  }

  static toAsignacionRutaDetalleResponse(
    model: AsignacionRutaDetalleEntity,
  ): AsignacionRutaDetalle {
    return {
      idAsignacion: model.idAsignacion,
      periodo: model.periodo,
      fechaProgramada: model.fechaProgramada,
      estadoAsignacion: model.estadoAsignacion,
      totalPredios: model.totalPredios,
      prediosLeidos: model.prediosLeidos,
      prediosConNovedad: model.prediosConNovedad,
      prediosPendientes: model.prediosPendientes,
      porcentajeAvance: model.porcentajeAvance,
      idRuta: model.idRuta,
      codigoRuta: model.codigoRuta,
      nombreRuta: model.nombreRuta,
      acometidas: model.acometidas,
    };
  }

  static toAsignacionRutaDetalleEntity(
    model: AcometidaRutaDetalleEntity,
  ): AcometidaRutaDetalle {
    return {
      idDetalle: model.idDetalle,
      acometidaId: model.acometidaId,
      orden: model.orden,
      cuenta: model.cuenta,
      numeroMedidor: model.numeroMedidor,
      abonado: model.abonado,
      clienteId: model.clienteId,
      direccion: model.direccion,
      referencia: model.referencia,
      latitud: model.latitud,
      longitud: model.longitud,
      ladoCalle: model.ladoCalle,
      pisoDepartamento: model.pisoDepartamento,
      instruccionAcceso: model.instruccionAcceso,
      lecturaAnterior: model.lecturaAnterior,
      consumoPromedio: model.consumoPromedio,
      estado: model.estado,
      lecturaActual: model.lecturaActual,
      fechaHoraCaptura: model.fechaHoraCaptura,
      tipoNovedadLecturaId: model.tipoNovedadLecturaId,
      estadoLecturaId: model.estadoLecturaId,
      observaciones: model.observaciones,
    };
  }
}
