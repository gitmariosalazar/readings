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
  has_current_reading: boolean;
  month_reading: string;
  start_date_period: Date;
  end_date_period: Date;
}

export interface AdvancedReportReadingsSQLResult {
  sector: number;
  total_connections: number;
  readings_completed: number;
  missing_readings: number;
  progress_percentage: number;
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

export class ReadingImagesSQLResult {
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
