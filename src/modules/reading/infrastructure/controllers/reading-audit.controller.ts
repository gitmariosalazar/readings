import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InitializeMonthlyAuditUseCase } from '../../application/usecases/audit/InitializeMonthlyAuditUseCase';
import { GetAuditByMonthUseCase } from '../../application/usecases/audit/GetAuditByMonthUseCase';
import { GetAuditBySectorAndMonthUseCase } from '../../application/usecases/audit/GetAuditBySectorAndMonthUseCase';
import { CloseAuditSectorUseCase } from '../../application/usecases/audit/CloseAuditSectorUseCase';
import { GetAuditHistoryBySectorUseCase } from '../../application/usecases/audit/GetAuditHistoryBySectorUseCase';
import {
  AuditSectorHistoryResponse,
  AuditSectorResponse,
  CloseAuditSectorResponse,
  InitializeAuditResponse,
} from '../../application/dtos/response/audit-sector.response';

@Controller()
export class ReadingAuditController {
  constructor(
    private readonly initializeMonthlyAuditUseCase: InitializeMonthlyAuditUseCase,
    private readonly getAuditByMonthUseCase: GetAuditByMonthUseCase,
    private readonly getAuditBySectorAndMonthUseCase: GetAuditBySectorAndMonthUseCase,
    private readonly closeAuditSectorUseCase: CloseAuditSectorUseCase,
    private readonly getAuditHistoryBySectorUseCase: GetAuditHistoryBySectorUseCase,
  ) {}

  /**
   * Inicializa las metas de auditoría para todos los sectores del mes dado.
   * Invoca pr_generar_auditoria_mensual($1) en la base de datos.
   * Pattern: reading.audit.initialize-monthly
   */
  @MessagePattern('reading.audit.initialize-monthly')
  async initializeMonthlyAudit(
    @Payload() month: string,
  ): Promise<InitializeAuditResponse> {
    return this.initializeMonthlyAuditUseCase.execute(month);
  }

  /**
   * Retorna el avance de auditoría de todos los sectores para un mes.
   * Pattern: reading.audit.by-month
   */
  @MessagePattern('reading.audit.by-month')
  async getAuditByMonth(
    @Payload() month: string,
  ): Promise<AuditSectorResponse[]> {
    return this.getAuditByMonthUseCase.execute(month);
  }

  /**
   * Retorna el detalle de auditoría de un sector específico para un mes.
   * Pattern: reading.audit.by-sector-and-month
   */
  @MessagePattern('reading.audit.by-sector-and-month')
  async getAuditBySectorAndMonth(
    @Payload() payload: { sector: number; month: string },
  ): Promise<AuditSectorResponse | null> {
    return this.getAuditBySectorAndMonthUseCase.execute(
      payload.sector,
      payload.month,
    );
  }

  /**
   * Cierra manualmente la auditoría de un sector con trazabilidad del supervisor.
   * Pattern: reading.audit.close-sector
   */
  @MessagePattern('reading.audit.close-sector')
  async closeAuditSector(
    @Payload()
    payload: {
      sector: number;
      month: string;
      supervisorId: string;
      observaciones?: string;
    },
  ): Promise<CloseAuditSectorResponse> {
    return this.closeAuditSectorUseCase.execute(
      payload.sector,
      payload.month,
      payload.supervisorId,
      payload.observaciones,
    );
  }

  /**
   * Retorna el histórico de avances de un sector en los últimos N meses.
   * Ideal para gráficas de tendencia. Por defecto retorna 12 meses.
   * Pattern: reading.audit.history-by-sector
   */
  @MessagePattern('reading.audit.history-by-sector')
  async getAuditHistoryBySector(
    @Payload() payload: { sector: number; months?: number },
  ): Promise<AuditSectorHistoryResponse[]> {
    return this.getAuditHistoryBySectorUseCase.execute(
      payload.sector,
      payload.months,
    );
  }
}
