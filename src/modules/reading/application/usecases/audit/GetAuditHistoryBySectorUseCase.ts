import { Injectable, Inject } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InterfaceReadingReportRepository } from '../../../domain/contracts/reading-report.interface.repository';
import { AuditSectorHistoryResponse } from '../../dtos/response/audit-sector.response';
import { AuditSectorHistoryModel } from '../../../domain/schemas/model/report/audit-sector.model';
import { ReadingAuditMapper } from '../../mappers/reading.audit.mapper';

@Injectable()
export class GetAuditHistoryBySectorUseCase {
  constructor(
    @Inject('ReadingReportRepository')
    private readonly reportRepository: InterfaceReadingReportRepository,
  ) {}

  async execute(
    sector: number,
    months?: number,
  ): Promise<AuditSectorHistoryResponse[]> {
    if (!sector || sector < 1) {
      throw new RpcException({
        statusCode: 400,
        message: 'Valid sector is required',
      });
    }
    const models: AuditSectorHistoryModel[] =
      await this.reportRepository.getAuditHistoryBySector(sector, months);
    return ReadingAuditMapper.fromAuditSectorHistoryModelListToResponseList(
      models,
    );
  }
}
