import {
  AuditSectorHistoryModel,
  AuditSectorModel,
  InitializeAuditModel,
  CloseAuditSectorModel,
} from '../../domain/schemas/model/report/audit-sector.model';
import {
  AuditSectorHistoryResponse,
  AuditSectorResponse,
  InitializeAuditResponse,
  CloseAuditSectorResponse,
} from '../dtos/response/audit-sector.response';

export class ReadingAuditMapper {
  static fromAuditSectorModelToResponse(
    domainModel: AuditSectorModel,
  ): AuditSectorResponse {
    return {
      auditId: domainModel.auditId,
      readingMonth: domainModel.readingMonth,
      sectorId: domainModel.sectorId,
      expectedTotal: domainModel.expectedTotal,
      completedTotal: domainModel.completedTotal,
      pendingTotal: domainModel.pendingTotal,
      progressPercentage: domainModel.progressPercentage,
      isComplete: domainModel.isComplete,
      closureDate: domainModel.closureDate,
      supervisorId: domainModel.supervisorId,
      observations: domainModel.observations,
      createdAt: domainModel.createdAt,
      updatedAt: domainModel.updatedAt,
    };
  }

  static fromAuditSectorModelListToResponseList(
    domainModels: AuditSectorModel[],
  ): AuditSectorResponse[] {
    return domainModels.map((model) =>
      this.fromAuditSectorModelToResponse(model),
    );
  }

  static fromAuditSectorHistoryModelToResponse(
    domainModel: AuditSectorHistoryModel,
  ): AuditSectorHistoryResponse {
    return {
      readingMonth: domainModel.readingMonth,
      sectorId: domainModel.sectorId,
      expectedTotal: domainModel.expectedTotal,
      completedTotal: domainModel.completedTotal,
      progressPercentage: domainModel.progressPercentage,
      isComplete: domainModel.isComplete,
      closureDate: domainModel.closureDate,
      supervisorId: domainModel.supervisorId,
      observations: domainModel.observations,
      createdAt: domainModel.createdAt,
    };
  }

  static fromAuditSectorHistoryModelListToResponseList(
    domainModels: AuditSectorHistoryModel[],
  ): AuditSectorHistoryResponse[] {
    return domainModels.map((model) =>
      this.fromAuditSectorHistoryModelToResponse(model),
    );
  }

  static fromCloseAuditSectorModelToResponse(
    domainModel: CloseAuditSectorModel,
  ): CloseAuditSectorResponse {
    return {
      auditId: domainModel.auditId,
      sectorId: domainModel.sectorId,
      readingMonth: domainModel.readingMonth,
      isComplete: domainModel.isComplete,
      closureDate: domainModel.closureDate,
      supervisorId: domainModel.supervisorId,
      observations: domainModel.observations,
      createdAt: domainModel.createdAt,
    };
  }

  static fromInitializeAuditModelToResponse(
    domainModel: InitializeAuditModel,
  ): InitializeAuditResponse {
    return {
      message: domainModel.message,
      period: domainModel.period,
      sectorsGenerated: domainModel.sectorsGenerated,
    };
  }
}
