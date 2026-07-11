export interface IncidentSQLResult {
  incident_id: string;
  acometida_id: string | null;
  codigo_incidente: string;
  lectura_id: number | null;
  tipo_incidente_id: number;
  descripcion_reporte: string;
  direccion_referencia: string | null;
  estado: string;
  origen_reporte: string;
  prioridad: string;
  fecha_reporte: Date;
  usuario_reporta_id: string | null;
  cliente_usuario_reporta_id: string | null;
  latitude: number | null;
  longitude: number | null;
  fecha_resolucion: Date | null;
  usuario_resuelve_id: string | null;
  descripcion_resolucion: string | null;
  cobrar_a_usuario: boolean;
  costo_reparacion: string; // postgres numeric maps to string in pg node client

  categoryName?: string | null;
  categoryCode?: string | null;
  incidentTypeName?: string | null;
  suggestedPriority?: string | null;
  reportedBy?: string | null;
  evidencePhotos?: Array<{
    photoId: number;
    filePath: string;
    type: string;
  }> | null;
  statusHistory?: Array<{
    changeDate: string | Date;
    previousStatus: string | null;
    newStatus: string;
    managedBy: string | null;
    observation: string | null;
  }> | null;
  reportClient?: {
    firstName: string;
    lastName: string;
    email: string | null;
    cellPhone: string | null;
  } | null;
}

export interface IncidentCategorySQLResult {
  category_id: number;
  category_code: string;
  category_name: string;
  category_description: string;
  incident_types: IncidentTypeSQLResult[];
}

export interface IncidentTypeSQLResult {
  type_code: string;
  type_name: string;
  type_description: string;
  suggested_priority: boolean;
}
