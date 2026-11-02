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
