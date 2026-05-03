import { Injectable, Inject } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InterfaceReadingReportRepository } from '../../../domain/contracts/reading-report.interface.repository';
import { CloseAuditSectorResponse } from '../../dtos/response/audit-sector.response';
import { CloseAuditSectorModel } from '../../../domain/schemas/model/report/audit-sector.model';
import { ReadingAuditMapper } from '../../mappers/reading.audit.mapper';

@Injectable()
export class CloseAuditSectorUseCase {
  constructor(
    @Inject('ReadingReportRepository')
    private readonly reportRepository: InterfaceReadingReportRepository,
  ) {}

  async execute(
    sector: number,
    month: string,
    supervisorId: string,
    observaciones?: string,
  ): Promise<CloseAuditSectorResponse> {
    if (!sector || sector < 1) {
      throw new RpcException({
        statusCode: 400,
        message: 'Valid sector is required',
      });
    }
    if (!month) {
      throw new RpcException({ statusCode: 400, message: 'Month is required' });
    }
    if (!supervisorId?.trim()) {
      throw new RpcException({
        statusCode: 400,
        message: 'supervisorId is required for supervised closure',
      });
    }

    const model: CloseAuditSectorModel =
      await this.reportRepository.closeAuditSector(
        sector,
        month,
        supervisorId,
        observaciones,
      );

    return ReadingAuditMapper.fromCloseAuditSectorModelToResponse(model);
  }
}
