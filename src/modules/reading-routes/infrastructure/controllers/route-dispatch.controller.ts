import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BatchMorningDispatchUseCase } from '../../application/usecases/commands/BatchMorningDispatchUseCase';
import { AssignSingleRouteUseCase } from '../../application/usecases/commands/AssignSingleRouteUseCase';
import { ReassignRouteSegmentUseCase } from '../../application/usecases/commands/ReassignRouteSegmentUseCase';
import { CancelRouteAssignmentUseCase } from '../../application/usecases/commands/CancelRouteAssignmentUseCase';
import { ResumeRouteAssignmentUseCase } from '../../application/usecases/commands/ResumeRouteAssignmentUseCase';
import { GetLiveTrackingAssignmentsUseCase } from '../../application/usecases/queries/GetLiveTrackingAssignmentsUseCase';
import {
  AssignSingleRouteRequest,
  BatchMorningDispatchRequest,
  ReassignRouteSegmentRequest,
} from '../../application/dtos/request/route-dtos.request';

@Controller()
export class RouteDispatchController {
  constructor(
    private readonly batchDispatchUseCase: BatchMorningDispatchUseCase,
    private readonly assignSingleUseCase: AssignSingleRouteUseCase,
    private readonly reassignSegmentUseCase: ReassignRouteSegmentUseCase,
    private readonly cancelAssignmentUseCase: CancelRouteAssignmentUseCase,
    private readonly resumeAssignmentUseCase: ResumeRouteAssignmentUseCase,
    private readonly liveTrackingUseCase: GetLiveTrackingAssignmentsUseCase,
  ) {}

  @MessagePattern(['reading-routes.dispatch.morning-batch', 'dispatch.morning-batch'])
  async bulkDispatch(
    @Payload()
    payload: {
      dto: BatchMorningDispatchRequest;
      supervisorId: string;
    } | BatchMorningDispatchRequest & { supervisorId?: string },
  ) {
    const dto = 'dto' in payload ? payload.dto : payload;
    const supervisorId =
      ('supervisorId' in payload && payload.supervisorId)
        ? payload.supervisorId
        : '00000000-0000-0000-0000-000000000001';
    return this.batchDispatchUseCase.execute(dto, supervisorId);
  }

  @MessagePattern(['reading-routes.dispatch.single', 'dispatch.single'])
  async assignSingle(
    @Payload()
    payload: {
      dto: AssignSingleRouteRequest;
      supervisorId: string;
    } | AssignSingleRouteRequest & { supervisorId?: string },
  ) {
    const dto = 'dto' in payload ? payload.dto : payload;
    const supervisorId =
      ('supervisorId' in payload && payload.supervisorId)
        ? payload.supervisorId
        : '00000000-0000-0000-0000-000000000001';
    return this.assignSingleUseCase.execute(dto, supervisorId);
  }

  @MessagePattern(['reading-routes.dispatch.reassign-segment', 'dispatch.reassign-segment'])
  async reassignSegment(
    @Payload()
    payload: {
      dto: ReassignRouteSegmentRequest;
      supervisorId: string;
    } | ReassignRouteSegmentRequest & { supervisorId?: string },
  ) {
    const dto = 'dto' in payload ? payload.dto : payload;
    const supervisorId =
      ('supervisorId' in payload && payload.supervisorId)
        ? payload.supervisorId
        : '00000000-0000-0000-0000-000000000001';
    return this.reassignSegmentUseCase.execute(dto, supervisorId);
  }

  @MessagePattern(['reading-routes.dispatch.live-tracking', 'dispatch.live-tracking'])
  async liveTracking(@Payload() payload: { periodo?: string; fecha?: string }) {
    return this.liveTrackingUseCase.execute(payload?.periodo, payload?.fecha);
  }

  @MessagePattern(['reading-routes.dispatch.cancel', 'dispatch.cancel'])
  async cancelAssignment(
    @Payload()
    payload: {
      idAsignacion: number;
      motivo?: string;
      supervisorId?: string;
    },
  ) {
    return this.cancelAssignmentUseCase.execute(
      payload.idAsignacion,
      payload.motivo,
      payload.supervisorId,
    );
  }

  @MessagePattern(['reading-routes.dispatch.resume', 'dispatch.resume'])
  async resumeAssignment(
    @Payload()
    payload: {
      idAsignacion: number;
      motivo?: string;
      supervisorId?: string;
    },
  ) {
    return this.resumeAssignmentUseCase.execute(
      payload.idAsignacion,
      payload.motivo,
      payload.supervisorId,
    );
  }
}
