export class RouteProgressDetailEntity {
  idDetalle!: number;
  asignacionId!: number;
  acometidaId!: string;
  ordenLectura!: number;
  estado!: string; // 'PENDIENTE' | 'LEIDO' | 'NOVEDAD' | 'OMITIDO'
  lecturaId?: number;
  fechaHoraLectura?: Date;
  latitudCaptura?: number;
  longitudCaptura?: number;
  distanciaMetrosAcometida?: number;
  observaciones?: string;
  createdAt?: Date;
  updatedAt?: Date;

  // Joined connection metadata
  cuenta?: string;
  numeroMedidor?: string;
  abonado?: string;
  direccion?: string;
  referencia?: string;
  latitudAcometida?: number;
  longitudAcometida?: number;
  ladoCalle?: string;
  instruccionAcceso?: string;
  lecturaAnterior?: number;
  consumoPromedio?: number;

  constructor(partial?: Partial<RouteProgressDetailEntity>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
