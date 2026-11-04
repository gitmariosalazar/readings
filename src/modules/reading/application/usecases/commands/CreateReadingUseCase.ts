import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { toZonedTime } from 'date-fns-tz';

import { CreateReadingRequest } from '../../dtos/request/create-reading.request';
import { ReadingResponse } from '../../dtos/response/reading.response';
import { CalculateReadingValueModel } from '../../../domain/schemas/model/calculate-reading-value.model';
import { InterfaceReadingRepository } from '../../../domain/contracts/reading.interface.repository';
import { ReadingModel } from '../../../domain/schemas/model/reading.model';
import { ReadingMapper } from '../../mappers/reading.mapper';
import { validateFields } from '../../../../../shared/validators/fields.validators';
import { statusCode } from '../../../../../settings/environments/status-code';

import { InterfaceObservationReadingRepository } from '../../../../observations/domain/contracts/observation-reading.interface.repository';
import { CreateObservationReadingRequest } from '../../../../observations/application/dtos/request/create-observatio-reading.request';
import { ObservationReadingModel } from '../../../../observations/domain/schemas/model/observation-reading.model';
import { ObservationReadingMapper } from '../../../../observations/application/mappers/observation-reading.mapper';
import { NoveltyModel } from '../../../domain/schemas/model/novelty.model';
import { getTypeCurrentConsumption } from '../../../../../shared/types/novelty.type';
import { UUID } from 'crypto';
import { InterfaceNoveltyRepository } from '../../../domain/contracts/novelty.interface.repository';
import { request } from 'express';

import { ReadingBillingBreakdownRecorder } from '../../services/reading-billing-breakdown-recorder.service';
import { CalculateReadingValueUseCase } from '../queries/CalculateReadingValueUseCase';

@Injectable()
export class CreateReadingUseCase {
  constructor(
    @Inject('ReadingRepository')
    private readonly readingRepository: InterfaceReadingRepository,
    @Inject('ObservationReadingRepository')
    private readonly observationRepository: InterfaceObservationReadingRepository,
    @Inject('NoveltyRepository')
    private readonly noveltyRepository: InterfaceNoveltyRepository,
    private readonly breakdownRecorder: ReadingBillingBreakdownRecorder,
    private readonly calculateReadingValueUseCase: CalculateReadingValueUseCase,
  ) {}

  async execute(
    readingRequest: CreateReadingRequest,
    creatorUserId: UUID,
  ): Promise<ReadingResponse | null> {
    try {
      const camposRequeridos: string[] = [
        'connectionId',
        'sewerRate',
        'previousReading',
        'incomeCode',
        'cadastralKey',
        'account',
        'sector',
        'readingValue',
        'currentReading',
        'rentalIncomeCode',
        'previousMonthReading',
      ];
      const mensajesFaltantes: string[] = validateFields(
        readingRequest,
        camposRequeridos,
      );

      const novedadDesdeSolicitud: string | null =
        readingRequest.novelty ?? null;

      if (mensajesFaltantes.length > 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: mensajesFaltantes,
        });
      }

      if (
        typeof readingRequest.currentReading !== 'number' ||
        readingRequest.currentReading < 0
      ) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'currentReading debe ser un número no negativo',
        });
      }
      if (
        typeof readingRequest.previousReading !== 'number' ||
        readingRequest.previousReading < 0
      ) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'previousReading debe ser un número no negativo',
        });
      }
      if (
        readingRequest.averageConsumption === undefined ||
        readingRequest.averageConsumption < 0
      ) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'averageConsumption debe ser un número no negativo',
        });
      }

      const ahora: Date = new Date();
      const hora: string = new Intl.DateTimeFormat('es-EC', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'America/Guayaquil',
      }).format(ahora);
      const fechaFormateada: Date = toZonedTime(ahora, 'America/Guayaquil');
      readingRequest.readingTime = hora;
      readingRequest.readingDate = fechaFormateada;

      // 1. Calcular consumo volumétrico (m3)
      const consumptionM3: number =
        Number(readingRequest.currentReading) -
        Number(readingRequest.previousReading);

      // 2. Liquidar valor tarifario y desgloses comerciales según pliego EPAA
      const valueConsumoAgua: CalculateReadingValueModel =
        await this.calculateReadingValueUseCase.execute(
          readingRequest.cadastralKey,
          consumptionM3,
        );

      readingRequest.readingValue = valueConsumoAgua.waterConsumptionValue;
      readingRequest.sewerRate = valueConsumoAgua.sewerageValue;
      readingRequest.totalValue = valueConsumoAgua.total;
      readingRequest.consumptionM3 = consumptionM3;

      // 3. Determinar novedad con Escudo de Tarifa Base (0-10 m3)
      const novelties = await this.noveltyRepository.findAllNovelties();

      const consumoActual: NoveltyModel = getTypeCurrentConsumption(
        readingRequest.previousReading,
        readingRequest.currentReading,
        readingRequest.averageConsumption,
        readingRequest.averageValue ?? null,
        novelties,
      );

      readingRequest.typeNoveltyReadingId = consumoActual.id;
      readingRequest.novelty = consumoActual.title;

      const paraCrear: ReadingModel =
        ReadingMapper.fromCreateReadingRequestToReadingModel(readingRequest);

      const creadoEntity: ReadingModel | null =
        await this.readingRepository.createReading(paraCrear, creatorUserId);

      if (creadoEntity === null) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: '¡Error al crear el registro de lectura!',
        });
      }
      await this.breakdownRecorder.record(creadoEntity.id, valueConsumoAgua);

      const creado: ReadingResponse =
        ReadingMapper.fromReadingModelToReadingResponse(creadoEntity);

      if (
        novedadDesdeSolicitud != null &&
        novedadDesdeSolicitud.trim().length > 0 &&
        novedadDesdeSolicitud !== consumoActual.title
      ) {
        const solicitudObservacion: CreateObservationReadingRequest = {
          readingId: creado.readingId,
          observationTitle: `Discrepancia de novedad en lectura ID: ${creado.readingId}`,
          observationDetails: `Novedad ingresada por el lecturista: ${novedadDesdeSolicitud}. Novedad calculada: ${consumoActual.title}. Acción recomendada: ${consumoActual.actionRecommended}`,
        };
        const modeloObservacion: ObservationReadingModel =
          ObservationReadingMapper.fromCreateObservationReadingToModel(
            solicitudObservacion,
          );
        const observacionCreada =
          await this.observationRepository.createObservationReading(
            modeloObservacion,
          );

        if (observacionCreada === null) {
          throw new RpcException({
            statusCode: statusCode.INTERNAL_SERVER_ERROR,
            message: `¡Error al crear la observación para la lectura con ID ${creado.readingId}!`,
          });
        }
      }

      if (consumoActual.id !== 1) {
        creado.novelty = consumoActual.title;

        // Calcular el exceso económico estimado frente al valor habitual o tarifa base
        const baseRate = valueConsumoAgua.baseRate ?? 3.70;
        const referenceValue = Math.max(
          readingRequest.averageValue ?? 0,
          baseRate,
        );
        const monetaryExcess = Math.max(
          0,
          (readingRequest.totalValue ?? 0) - referenceValue,
        );
        const monetaryDetail =
          monetaryExcess > 0
            ? ` | Exceso económico estimado: $${monetaryExcess.toFixed(2)} (Total planilla: $${(readingRequest.totalValue ?? 0).toFixed(2)} vs Promedio/Base: $${referenceValue.toFixed(2)}).`
            : '';

        const solicitudObservacion: CreateObservationReadingRequest = {
          readingId: creado.readingId,
          observationTitle: `NOVEDAD DETECTADA EN LECTURA ID: ${creado.readingId}`,
          observationDetails: `${consumoActual.description}${monetaryDetail} Acción recomendada: ${consumoActual.actionRecommended}`,
        };
        const modeloObservacion: ObservationReadingModel =
          ObservationReadingMapper.fromCreateObservationReadingToModel(
            solicitudObservacion,
          );
        const observacionCreada =
          await this.observationRepository.createObservationReading(
            modeloObservacion,
          );

        if (observacionCreada === null) {
          throw new RpcException({
            statusCode: statusCode.INTERNAL_SERVER_ERROR,
            message: `¡Error al crear la observación para la lectura con ID ${creado.readingId}!`,
          });
        }
      }

      return creado;
    } catch (error) {
      throw error;
    }
  }

  private CalculateSewerRate(readingValue: number): number {
    return readingValue * (40 / 100); // 40% of the reading value
  }
}
