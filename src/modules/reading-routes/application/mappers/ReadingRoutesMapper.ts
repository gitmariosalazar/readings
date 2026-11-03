import { RouteConnectionModel } from '../../domain/entities/route-connection.entity';
import { RouteConnectionResponse } from '../dtos/response/route-dtos.response';

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
}
