import { Injectable, Inject } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InterfaceReadingReportRepository } from '../../../domain/contracts/reading-report.interface.repository';
import { InitializeAuditResponse } from '../../dtos/response/audit-sector.response';
import { InitializeAuditModel } from '../../../domain/schemas/model/report/audit-sector.model';
import { ReadingAuditMapper } from '../../mappers/reading.audit.mapper';

@Injectable()
export class InitializeMonthlyAuditUseCase {
  constructor(
    @Inject('ReadingReportRepository')
    private readonly reportRepository: InterfaceReadingReportRepository,
  ) {}

  async execute(month: string): Promise<InitializeAuditResponse> {
    if (!month) {
      throw new RpcException({ statusCode: 400, message: 'Month is required' });
    }
    const model: InitializeAuditModel =
      await this.reportRepository.initializeMonthlyAudit(month);
    return ReadingAuditMapper.fromInitializeAuditModelToResponse(model);
  }
}
