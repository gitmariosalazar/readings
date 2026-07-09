export interface ReadingBasicInfoSQLResult {
  reading_id: number;
  previous_reading_date: Date | null;
  cadastral_key: string;
  card_id: string;
  client_name: string;
  address: string;
  previous_reading: number;
  current_reading: number | null;
  sector: number;
  account: number;
  location_capture?: { lat: number; lng: number } | null;
  reading_value: number;
  average_consumption: number;
  meter_number: string;
  rate_id: number;
  rate_name: string;
}

export interface ReadingSQLResult {
  reading_id: number;
  connection_id: string;
  reading_date: Date | null;
  reading_time: string | null;
  sector: number;
  account: number;
  cadastral_key: string;
  reading_value: number | null;
  sewer_rate: number | null;
  previous_reading: number | null;
  current_reading: number | null;
  rental_income_code: number | null;
  novelty: string | null;
  income_code: number | null;
  average_consumption: number;
  location_capture?: { lat: number; lng: number } | null;
}

export interface ClientPhoneSQLResult {
  telefono_id: number;
  numero: string;
}

export interface ClientEmailSQLResult {
  correo_electronico_id: number;
  correo: string;
}

export interface ReadingInfoSQLResult {
  reading_id: number;
  previous_reading_date: Date | null;
  reading_time: Date | null;
  cadastral_key: string;
  card_id: string;
  client_name: string;
  client_phones: ClientPhoneSQLResult[];
  client_emails: ClientEmailSQLResult[];
  address: string;
  previous_reading: number;
  current_reading: number | null;
  sector: number;
  account: number;
  reading_value: number;
  average_consumption: number;
  meter_number: string;
  rate_id: number;
  rate_name: string;
  has_current_reading: boolean | null | number;
  month_reading: string;
  start_date_period: Date;
  end_date_period: Date;
  connection_state_id: number;
  connection_state_name: string;
  connection_state_description: string;
  permit_reading: boolean | null | number;
}

export interface AdvancedReportReadingsSQLResult {
  sector: number;
  total_connections: number;
  readings_completed: number;
  missing_readings: number;
  progress_percentage: number;

  pure_active_units: number;
  suspended_or_arrears_with_reading: number;
  data_discrepancy: number;
  total_visit_efficiency: number;

  // Cross-validation columns from auditoria_lectura_sector (0 if not yet generated)
  audit_total_esperado: number;
  audit_total_completadas: number;
  audit_avance_porcentaje: number;
  audit_completo: boolean;
}

export interface ReadingHistorySQLResult {
  reading_id: number;
  connection_id: string;
  reading_year: number;
  reading_month: string;
  reading_date: Date;
  reading_time: string;
  previous_reading: number;
  current_reading: number;
  consumption: number;
  observation: string;
}

export interface ReadingImagesSQLResult {
  cadastral_key: string;
  reading_id: number;
  previews_reading: number;
  current_reading: number;
  images: string[];
  reading_month: string;
  reading_year: number;
  reading_month_name: string;
  novelty: string;
  consumption: number;
  observation: string;
}

export interface PendingReadingConnectionSQLResult {
  cadastral_key: string;
  meter_number: string;
  address: string;
  sector: number;
  account: number;
  client_name: string;
  card_id: string;
  rate_name: string;
  average_consumption: number;
}

export interface TakenReadingConnectionSQLResult {
  reading_id: string;
  reading_date: string; // ISO string
  cadastral_key: string;
  meter_number: string;
  address: string;
  sector: number;
  account: number;
  client_name: string;
  card_id: string;
  previous_reading: number;
  current_reading: number;
  reading_value: number;
  calculated_consumption: number;
  average_consumption: number;
  rate_name: string;
  reading_type_id: number;
  reading_type_name: string;
  novelty: string;
  location_capture?: { lat: number; lng: number } | null;
  location_connection?: { lat: number; lng: number } | null;
  distance_meters?: number | null;
  is_inside_allowed_radius?: boolean | null;
  distance_line_geojson?: any | null;
}

export interface MonthlySummarySQLResult {
  month: string;
  total_readings: number;
  total_consumption: number;
  average_consumption: number;
  max_consumption: number;
  min_consumption: number;
  incident_count: number;
  incident_rate_percentage: number;
}

export interface ReadingNoveltySQLResult {
  reading_id: number;
  reading_date: Date | null;
  reading_month: string;
  reading_time: string | null;
  cadastral_key: string;
  meter_number: string;
  address: string;
  sector: number;
  account: number;
  client_name: string;
  card_id: string;
  previous_reading: number;
  current_reading: number | null;
  reading_value: number | null;
  calculated_consumption: number | null;
  average_consumption: number | null;
  rate_name: string;
  reading_type_id: number;
  reading_type_name: string;
  novelty: string;
  novelty_type_id: number | null;
  novelty_type_name: string | null;
  novelty_type_description: string | null;
  images: string[];
  location_capture?: { lat: number; lng: number } | null;
  location_connection?: { lat: number; lng: number } | null;
  distance_meters?: number | null;
  is_inside_allowed_radius?: boolean | null;
  distance_line_geojson?: any | null;
}
