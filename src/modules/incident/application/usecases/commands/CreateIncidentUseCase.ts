import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { UUID } from 'crypto';
import { CreateIncidentRequest } from '../../dtos/request/create-incident.request';
import { IncidentResponse } from '../../dtos/response/incident.response';
import { InterfaceIncidentRepository } from '../../../domain/contracts/incident.interface.repository';
import { IncidentMapper } from '../../mappers/incident.mapper';
import { validateFields } from '../../../../../shared/validators/fields.validators';
import { statusCode } from '../../../../../settings/environments/status-code';

@Injectable()
export class CreateIncidentUseCase {
  constructor(
    @Inject('IncidentRepository')
    private readonly incidentRepository: InterfaceIncidentRepository,
  ) {}

  async execute(
    request: CreateIncidentRequest,
    reporterUserId: UUID | null,
    clienteUsuarioReportaId: UUID | null,
  ): Promise<IncidentResponse | null> {
    try {
      const camposRequeridos = [
        'incidentTypeId',
        'reportDescription',
        'reportOrigin',
      ];
      const errores = validateFields(request, camposRequeridos);

      if (errores.length > 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: errores,
        });
      }

      // Regla de negocio: Si no hay acometida vinculada, debe proporcionarse coordenadas o dirección
      if (
        !request.connectionId &&
        !request.referenceAddress &&
        (request.latitude === undefined || request.longitude === undefined)
      ) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message:
            'Para registrar incidentes en la red matriz o vía pública debe proporcionar coordenadas GPS o una dirección física de referencia.',
        });
      }

      const model = IncidentMapper.fromCreateRequestToModel(
        request,
        reporterUserId,
        clienteUsuarioReportaId,
      );

      // ====================================================================
      // REGLA DE NEGOCIO (Clean Architecture)
      // ====================================================================
      const isRoutineReading =
        request.incidentCategory === 'RUTA LECTURA' &&
        request.incidentTypeId === 32;

      const isMeterBad =
        request.meterPhysicalState === 'MALO' ||
        request.meterPhysicalState === 'DESTRUIDO' ||
        request.meterPhysicalState === 'NO_IDENTIFICADO' ||
        request.meterCondition === 'NO_IDENTIFICADO';

      // SOLO OMITIMOS el ticket si ES rutinario (32) Y el medidor NO está dañado.
      // En todos los demás casos (ID diferente, o medidor dañado), SÍ creamos el ticket.
      const shouldCreateTicket = !(isRoutineReading && !isMeterBad);

      const savedModel = await this.incidentRepository.createIncident(
        model,
        request.images ?? [],
        shouldCreateTicket,
      );

      if (!savedModel) {
        // Validamos si no se guardó de forma intencional por regla de negocio
        if (!shouldCreateTicket) {
          // Retornamos null con éxito, indicando que fue omitido correctamente.
          return null;
        }

        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'No se pudo guardar el incidente en la base de datos.',
        });
      }
      return IncidentMapper.fromModelToResponse(savedModel);
    } catch (error) {
      throw error;
    }
  }
}
