import { Injectable, Inject } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InterfaceReadingReportRepository } from '../../../domain/contracts/reading-report.interface.repository';
import { AuditSectorResponse } from '../../dtos/response/audit-sector.response';
import { AuditSectorModel } from '../../../domain/schemas/model/report/audit-sector.model';
import { ReadingAuditMapper } from '../../mappers/reading.audit.mapper';

@Injectable()
export class GetAuditByMonthUseCase {
  constructor(
    @Inject('ReadingReportRepository')
    private readonly reportRepository: InterfaceReadingReportRepository,
  ) {}

  async execute(month: string): Promise<AuditSectorResponse[]> {
    if (!month) {
      throw new RpcException({ statusCode: 400, message: 'Month is required' });
    }

    const models: AuditSectorModel[] =
      await this.reportRepository.getAuditByMonth(month);

    return models.map((model) =>
      ReadingAuditMapper.fromAuditSectorModelToResponse(model),
    );
  }
}
