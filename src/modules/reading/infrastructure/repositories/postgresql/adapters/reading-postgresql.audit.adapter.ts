import {
  AuditSectorHistoryModel,
  AuditSectorModel,
  CloseAuditSectorModel,
  InitializeAuditModel,
} from '../../../../domain/schemas/model/report/audit-sector.model';
import {
  AuditSectorHistorySqlResult,
  AuditSectorSqlResult,
  CloseAuditSectorSqlResult,
  InitializeAuditSqlResult,
} from '../../../interfaces/sql/reading-sql.audit.interface';

export class ReadingAuditMapper {
  static toAuditSectorModel(
    domainModel: AuditSectorSqlResult,
  ): AuditSectorModel {
    return new AuditSectorModel(
      domainModel.audit_idd,
      domainModel.reading_month,
      domainModel.sector_id,
      domainModel.expected_total,
      domainModel.completed_total,
      domainModel.pending_total,
      domainModel.progress_percentage,
      domainModel.is_complete,
      domainModel.closure_date,
      domainModel.supervisor_id,
      domainModel.observations,
      domainModel.created_at,
      domainModel.updated_at,
    );
  }

  static toAuditSectorHistoryModel(
    domainModel: AuditSectorHistorySqlResult,
  ): AuditSectorHistoryModel {
    return new AuditSectorHistoryModel(
      domainModel.reading_month,
      domainModel.sector_id,
      domainModel.expected_total,
      domainModel.completed_total,
      domainModel.progress_percentage,
      domainModel.is_complete,
      domainModel.closure_date,
      domainModel.supervisor_id,
      domainModel.observations,
      domainModel.created_at,
    );
  }

  static fromCloseAuditSectorSqlResultToModel(
    sqlResult: CloseAuditSectorSqlResult,
  ): CloseAuditSectorModel {
    return new CloseAuditSectorModel(
      sqlResult.audit_id,
      sqlResult.sector_id,
      sqlResult.reading_month,
      sqlResult.is_complete,
      sqlResult.closure_date,
      sqlResult.supervisor_id,
      sqlResult.observations,
      sqlResult.created_at,
    );
  }

  static fromInitializeAuditSqlResultToModel(
    sqlResult: InitializeAuditSqlResult,
  ): InitializeAuditModel {
    return new InitializeAuditModel(
      sqlResult.message,
      sqlResult.period,
      sqlResult.sectors_generated,
    );
  }

  // Lists
  static toListOfAuditSectorModels(
    sqlResults: AuditSectorSqlResult[],
  ): AuditSectorModel[] {
    return sqlResults.map((result) => this.toAuditSectorModel(result));
  }

  static toListOfAuditSectorHistoryModels(
    sqlResults: AuditSectorHistorySqlResult[],
  ): AuditSectorHistoryModel[] {
    return sqlResults.map((result) => this.toAuditSectorHistoryModel(result));
  }

  static toListOfCloseAuditSectorModels(
    sqlResults: CloseAuditSectorSqlResult[],
  ): CloseAuditSectorModel[] {
    return sqlResults.map((result) =>
      this.fromCloseAuditSectorSqlResultToModel(result),
    );
  }

  static toListOfInitializeAuditModels(
    sqlResults: InitializeAuditSqlResult[],
  ): InitializeAuditModel[] {
    return sqlResults.map((result) =>
      this.fromInitializeAuditSqlResultToModel(result),
    );
  }
}
