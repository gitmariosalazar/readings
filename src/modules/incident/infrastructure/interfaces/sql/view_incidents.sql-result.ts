// 1. Interfaces para la información de contacto y multimedia
export interface ContactPhoneSQLResult {
  telefono_id: number;
  numero: string;
}

export interface ContactEmailSQLResult {
  correo_electronico_id: number;
  correo: string;
}

export interface EvidencePhotoSQLResult {
  id: number;
  file_path: string;
  type: 'REPORTE' | 'RESOLUCION';
  created_at: string; // ISO 8601 Date string
}

export interface IncidentHistorySQLResult {
  date_change: string; // ISO 8601 Date string
  previous_status: string | null;
  new_status: string;
  managed_by: string | Record<string, any>;
  observation: string | null;
}

// 2. Interfaces para los objetos JSON del usuario que reporta
export interface ReporterCompanySQLResult {
  company_id: string; // UUID
  commercial_name: string | null;
  business_name: string | null;
  ruc: string;
  address: string | null;
  parish_id: string | null;
  country: string | null;
  client_id: string;
  phones: ContactPhoneSQLResult[];
  emails: ContactEmailSQLResult[];
}

export interface ReporterPersonSQLResult {
  person_id: string;
  first_name: string;
  last_name: string;
  birth_date: string | null; // Date string
  is_deceased: boolean;
  gender_id: number;
  civil_status_id: number;
  profession_id: number;
  parish_id: string;
  address: string | null;
  country: string | null;
  phones: ContactPhoneSQLResult[];
  emails: ContactEmailSQLResult[];
}

export interface ReporterEmployeeSQLResult {
  employee_id: string; // UUID
  user_id: string; // UUID
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface UserRowSQLResult {
  name: string; // UUID
  card_id: string;
  user_type: string;
  email: string | null;
  phone: string | null;
}

// 3. Interfaz Principal (La Fila de la Vista)
export interface IncidentDetailRowSQLResult {
  incident_id: string;
  connection_id: string | null;
  order_code: string | null;
  incident_code: string;
  reading_id: number | null;

  // Categoría y Tipo
  category_id: number;
  category_code: string;
  category_name: string;
  incident_type_id: number;
  incident_type_name: string;
  suggested_priority: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';

  // Información del Reporte
  report_description: string;
  reference_address: string | null;
  status: 'REPORTADO' | 'EN_INSPECCION' | 'RESUELTO' | 'FALSO_REPORTE';
  report_origin:
    | 'LECTURISTA'
    | 'ATENCION_AL_CLIENTE'
    | 'INSPECTOR'
    | 'WEB_USUARIO';
  current_priority: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  report_date: string; // ISO 8601 Date string
  latitude: number | null;
  longitude: number | null;

  // Usuario que reporta
  reported_by: UserRowSQLResult; // Resumen en texto: Ej. "EMPLEADO: Juan Perez"
  company: ReporterCompanySQLResult | null;
  person: ReporterPersonSQLResult | null;

  // Resolución
  resolution_date: string | null; // ISO 8601 Date string
  resolved_by: UserRowSQLResult | null;
  resolution_description: string | null;

  // Aspectos financieros
  charge_to_user: boolean;
  repair_cost: number | string; // postgres numeric retorna string en node-postgres por defecto (puedes usar Number(x))

  // Evidencias (Reporte y Resolución)
  photos_report: EvidencePhotoSQLResult[];
  photos_report_count: number | string; // postgres count(x) retorna bigint como string

  photos_resolution: EvidencePhotoSQLResult[];
  photos_resolution_count: number | string;

  // Historial
  history_recent: IncidentHistorySQLResult[];

  // Métricas de tiempo
  open_days: number | null;
  pending_days: number | null;

  // Auditoría básica
  created_at: string; // ISO 8601 Date string
  updated_at: string; // ISO 8601 Date string
  previous_order_state: string | null;
  current_order_state: string | null;
}
