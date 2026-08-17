export interface IncidentChangeDetail {
  clave_catastral?: string;
  numero_medidor?: string;
  serie?: string;
  ubicacion?: string;
  observaciones?: string;
}

export class ResolveIncidentRequest {
  description!: string;
  repairCost!: number;
  chargeToUser!: boolean;
  images?: string[];
  // Solo se envía cuando el usuario reporta cambios de datos del medidor/predio
  changeDetails?: IncidentChangeDetail[];
}
