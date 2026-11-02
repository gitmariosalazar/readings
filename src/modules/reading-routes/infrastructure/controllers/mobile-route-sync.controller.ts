import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetMobileWorkPackUseCase } from '../../application/usecases/queries/GetMobileWorkPackUseCase';
import { SyncMobileReadingsBatchUseCase } from '../../application/usecases/commands/SyncMobileReadingsBatchUseCase';
import { GetLecturistDailyKpiUseCase } from '../../application/usecases/queries/GetLecturistDailyKpiUseCase';
import { SyncMobileReadingsBatchRequest } from '../../application/dtos/request/route-dtos.request';

@Controller()
export class MobileRouteSyncController {
  constructor(
    private readonly getMobileWorkPackUseCase: GetMobileWorkPackUseCase,
    private readonly syncMobileReadingsBatchUseCase: SyncMobileReadingsBatchUseCase,
    private readonly getLecturistDailyKpiUseCase: GetLecturistDailyKpiUseCase,
  ) {}

  @MessagePattern(['reading-routes.mobile.get-pack', 'mobile.get-pack'])
  async getPack(@Payload() payload: { assignmentId: number } | number) {
    const assignmentId =
      typeof payload === 'number' ? payload : payload?.assignmentId;
    return this.getMobileWorkPackUseCase.execute(Number(assignmentId));
  }

  @MessagePattern(['reading-routes.mobile.sync-readings', 'mobile.sync-readings'])
  async syncReadings(
    @Payload()
    payload: {
      dto: SyncMobileReadingsBatchRequest;
      usuarioId: string;
    } | SyncMobileReadingsBatchRequest & { usuarioId?: string },
  ) {
    const dto = 'dto' in payload ? payload.dto : payload;
    const usuarioId =
      ('usuarioId' in payload && payload.usuarioId)
        ? payload.usuarioId
        : '00000000-0000-0000-0000-000000000001';
    return this.syncMobileReadingsBatchUseCase.execute(dto, usuarioId);
  }

  @MessagePattern(['reading-routes.mobile.get-my-kpi', 'mobile.get-my-kpi'])
  async getMyKpi(@Payload() payload: { usuarioId: string; fecha?: string }) {
    return this.getLecturistDailyKpiUseCase.execute(
      payload.usuarioId,
      payload.fecha,
    );
  }
}
