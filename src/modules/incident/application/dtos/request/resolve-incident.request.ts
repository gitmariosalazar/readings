export interface IncidentChangeDetail {
  clave_catastral?: string;
  numero_medidor?: string;
  serie?: string;
  ubicacion?: string;
  observaciones?: string;
  medidor_anterior?: {
    numero_medidor?: string;
    ultima_lectura?: number;
    fecha_ultima_lectura?: string; // ISO 8601 Date string
  };
  medidor_nuevo?: {
    numero_medidor?: string;
    lectura_anterior?: number;
    lectura_actual?: number;
    fecha_ultima_lectura?: string; // ISO 8601 Date string
  };
}

export class ResolveIncidentRequest {
  description!: string;
  repairCost!: number;
  chargeToUser!: boolean;
  images?: string[];
  // Solo se envía cuando el usuario reporta cambios de datos del medidor/predio
  changeDetails?: IncidentChangeDetail[];
}
