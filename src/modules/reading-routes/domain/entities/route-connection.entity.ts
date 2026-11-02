export class RouteConnectionEntity {
  idRutaAcometida!: number;
  rutaId!: number;
  acometidaId!: string;
  ordenSecuencia!: number;
  ladoCalle?: string;
  instruccionAcceso?: string;
  activo!: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial?: Partial<RouteConnectionEntity>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}

export class RouteConnectionModel {
  idRutaAcometida!: number;
  rutaId!: number;
  acometidaId!: string;
  ordenSecuencia!: number;
  ladoCalle?: string;
  pisoDepartamento?: string;
  instruccionAcceso?: string;
  activo!: boolean;
  cuenta?: string;
  numeroMedidor?: string;
  abonado?: string;
  direccion?: string;
  referencia?: string;
  latitud?: number;
  longitud?: number;
  consumoPromedio?: number;
}
