import { Injectable, Inject } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InterfaceReadingReportRepository } from '../../../domain/contracts/reading-report.interface.repository';
import { AuditSectorResponse } from '../../dtos/response/audit-sector.response';
import { ReadingAuditMapper } from '../../mappers/reading.audit.mapper';
import { AuditSectorModel } from '../../../domain/schemas/model/report/audit-sector.model';

@Injectable()
export class GetAuditBySectorAndMonthUseCase {
  constructor(
    @Inject('ReadingReportRepository')
    private readonly reportRepository: InterfaceReadingReportRepository,
  ) {}

  async execute(
    sector: number,
    month: string,
  ): Promise<AuditSectorResponse | null> {
    if (!sector || sector < 1) {
      throw new RpcException({
        statusCode: 400,
        message: 'Valid sector is required',
      });
    }
    if (!month) {
      throw new RpcException({ statusCode: 400, message: 'Month is required' });
    }
    const model: AuditSectorModel | null =
      await this.reportRepository.getAuditBySectorAndMonth(sector, month);
    return model
      ? ReadingAuditMapper.fromAuditSectorModelToResponse(model)
      : null;
  }
}
