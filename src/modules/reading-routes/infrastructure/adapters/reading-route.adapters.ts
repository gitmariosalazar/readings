import { RouteConnectionModel } from '../../domain/entities/route-connection.entity';
import { RouteConnectionSqlResult } from '../interfaces/reading-route.interface';

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
}
