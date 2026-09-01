export interface ReadingAdjustmentTypeModel {
  tipoAjusteId: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  afectaLecturaAnterior: boolean;
  estado: boolean;
}

export interface ReadingAdjustmentModel {
  historialAjusteId?: number;
  lecturaId: number;
  tipoAjusteId: number;
  lecturaAnteriorPrevia?: number | null;
  lecturaActualPrevia?: number | null;
  consumoPrevio?: number | null;
  lecturaAnteriorNueva: number | null;
  lecturaActualNueva: number | null;
  consumoNuevo?: number | null;
  justificacion: string | null;
  usuarioId: string;
  fechaAjuste?: Date;
}
