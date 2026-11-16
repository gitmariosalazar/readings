export class ReadingRouteEntity {
  idRuta!: number;
  sectorId!: number;
  zonaId?: number;
  codigo!: string;
  nombre!: string;
  descripcion?: string;
  cantidadAcometidas!: number;
  tiempoEstimadoHoras!: number;
  distanciaEstimadaKm?: number;
  colorIdentificador!: string;
  poligono?: string | any;
  esRural!: boolean;
  activa!: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial?: Partial<ReadingRouteEntity>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}

export class AsignacionRutaDetalleEntity {
  idAsignacion!: number;
  periodo!: string; // O Date, dependiendo de cómo esté definido periodo_mes en tu BD
  fechaProgramada!: string | Date | null;
  estadoAsignacion!: string;
  totalPredios!: number;
  prediosLeidos!: number;
  prediosConNovedad!: number;
  prediosPendientes!: number;
  porcentajeAvance!: number;
  idRuta!: number;
  codigoRuta!: string;
  nombreRuta!: string;
  acometidas!: AcometidaRutaDetalleEntity[];
  constructor(partial?: Partial<AsignacionRutaDetalleEntity>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}

export class AcometidaRutaDetalleEntity {
  idDetalle!: number;
  acometidaId!: number | string;
  orden!: number;
  cuenta!: string | null;
  numeroMedidor!: string | null;
  abonado!: string;
  clienteId!: string | number | null;
  direccion!: string | null;
  referencia!: string | null;
  latitud!: number | null;
  longitud!: number | null;
  ladoCalle!: string | null;
  pisoDepartamento!: string | null;
  instruccionAcceso!: string | null;
  lecturaAnterior!: number;
  consumoPromedio!: number | null;
  estado!: string | null;
  lecturaActual!: number | null;
  fechaHoraCaptura!: string | Date | null;
  tipoNovedadLecturaId!: number | null;
  estadoLecturaId!: number | null;
  observaciones!: string | null;
  constructor(partial?: Partial<AcometidaRutaDetalleEntity>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
