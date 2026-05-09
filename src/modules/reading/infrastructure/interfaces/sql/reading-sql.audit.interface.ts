export interface AuditSectorSqlResult {
  audit_idd: number;
  reading_month: Date; // mesLectura
  sector_id: number;
  expected_total: number; // totalEsperado
  completed_total: number; // totalCompletadas
  pending_total: number; // totalPendientes
  progress_percentage: number; // avancePorcentaje
  is_complete: boolean | null | number; // completo
  closure_date: Date | null; // fechaCierre
  supervisor_id: string | null;
  observations: string | null; // observaciones
  created_at: Date;
  updated_at: Date;
}

export interface AuditSectorHistorySqlResult {
  reading_month: Date;
  sector_id: number;
  expected_total: number;
  completed_total: number;
  progress_percentage: number;
  is_complete: boolean | null | number;
  closure_date: Date | null;
  supervisor_id: string | null;
  observations: string | null;
  created_at: Date;
}

export interface CloseAuditSectorSqlResult {
  audit_id: number;
  sector_id: number;
  reading_month: Date;
  is_complete: boolean | null | number;
  closure_date: Date;
  supervisor_id: string;
  observations: string | null;
  created_at: Date;
}

export interface InitializeAuditSqlResult {
  message: string;
  period: string;
  sectors_generated: number;
}
