import { Inject, Injectable } from '@nestjs/common';
import { InterfaceIncidentRepository } from '../../../domain/contracts/incident.interface.repository';
import { IncidentDashboardResponseDto } from '../../dtos/response/incident-dashboard.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class GetIncidentDashboardKpisUseCase {
  constructor(
    @Inject('IncidentRepository')
    private readonly incidentRepository: InterfaceIncidentRepository,
  ) {}

  async execute(): Promise<IncidentDashboardResponseDto> {
    try {
      const dashboard = await this.incidentRepository.getIncidentDashboardKpis();
      
      if (!dashboard) {
        throw new RpcException({
          statusCode: 404,
          message: 'No se encontraron datos para el dashboard de incidentes',
        });
      }

      return dashboard;
    } catch (error) {
      throw error;
    }
  }
}
