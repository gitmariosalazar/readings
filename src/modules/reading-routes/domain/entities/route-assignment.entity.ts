export class RouteAssignmentEntity {
  idAsignacion!: number;
  rutaId!: number;
  usuarioId!: string;
  empleadoId?: string;
  periodoMes!: string;
  fechaProgramada!: Date;
  fechaInicio?: Date;
  fechaCierre?: Date;
  estado!: string; // 'PENDIENTE' | 'EN_CURSO' | 'COMPLETADA' | 'CANCELADA'
  totalPredios!: number;
  prediosLeidos!: number;
  prediosConNovedad!: number;
  prediosPendientes!: number;
  porcentajeAvance!: number;
  esReasignacion!: boolean;
  asignacionOrigenId?: number;
  motivoReasignacion?: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;

  // Joined fields for display
  codigoRuta?: string;
  nombreRuta?: string;
  nombreLecturista?: string;

  constructor(partial?: Partial<RouteAssignmentEntity>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
