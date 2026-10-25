import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpcProxy, RpcException } from '@nestjs/microservices';
import { UpdateReadingRequest } from '../../dtos/request/update-reading.request';
import { CreateReadingRequest } from '../../dtos/request/create-reading.request';
import { ReadingResponse } from '../../dtos/response/reading.response';
import { InterfaceReadingRepository } from '../../../domain/contracts/reading.interface.repository';
import { ReadingModel } from '../../../domain/schemas/model/reading.model';
import { ReadingMapper } from '../../mappers/reading.mapper';
import { validateFields } from '../../../../../shared/validators/fields.validators';
import { statusCode } from '../../../../../settings/environments/status-code';
import { NoveltyModel } from '../../../domain/schemas/model/novelty.model';
import { getTypeCurrentConsumption } from '../../../../../shared/types/novelty.type';
import { UUID } from 'crypto';
import { InterfaceNoveltyRepository } from '../../../domain/contracts/novelty.interface.repository';

import { ReadingBillingBreakdownRecorder } from '../../services/reading-billing-breakdown-recorder.service';
import { CalculateReadingValueUseCase } from '../queries/CalculateReadingValueUseCase';
import { CalculateReadingValueModel } from '../../../domain/schemas/model/calculate-reading-value.model';

@Injectable()
export class UpdateReadingUseCase {
  constructor(
    @Inject('ReadingRepository')
    private readonly readingRepository: InterfaceReadingRepository,
    @Inject('NoveltyRepository')
    private readonly noveltyRepository: InterfaceNoveltyRepository,
    private readonly breakdownRecorder: ReadingBillingBreakdownRecorder,
    private readonly calculateReadingValueUseCase: CalculateReadingValueUseCase,
  ) {}

  async execute(
    readingId: number,
    readinRequest: UpdateReadingRequest,
    updateUserId: UUID,
  ): Promise<ReadingResponse | null> {
    try {
      const requiredFields: string[] = [
        'previousReading',
        'currentReading',
        'rentalIncomeCode',
        //'novelty',
        'incomeCode',
        'cadastralKey',
        'connectionId',
        'account',
        'sector',
        'averageConsumption',
        'readingMonth',
      ];
      const missingFieldMessages: string[] = validateFields(
        readinRequest,
        requiredFields,
      );

      if (missingFieldMessages.length > 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: missingFieldMessages,
        });
      }

      const exists: boolean =
        await this.readingRepository.verifyReadingIfExist(readingId);
      if (!exists) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `Reading with ID ${readingId} not found!`,
        });
      }

      const novelty: string | null = readinRequest.novelty ?? null;

      if (
        typeof readinRequest.currentReading !== 'number' ||
        readinRequest.currentReading < 0
      ) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'currentReading debe ser un número no negativo',
        });
      }
      if (
        typeof readinRequest.previousReading !== 'number' ||
        readinRequest.previousReading < 0
      ) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'previousReading debe ser un número no negativo',
        });
      }
      if (
        readinRequest.averageConsumption === undefined ||
        readinRequest.averageConsumption! < 0
      ) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'averageConsumption debe ser un número no negativo',
        });
      }

      if (readinRequest.currentReading! < readinRequest.previousReading!) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: `The current reading cannot be less than the previous reading!`,
        });
      }

      const novelties = await this.noveltyRepository.findAllNovelties();

      const consumoActual: NoveltyModel = getTypeCurrentConsumption(
        readinRequest.previousReading,
        readinRequest.currentReading,
        readinRequest.averageConsumption!,
        novelties,
      );

      readinRequest.typeNoveltyReadingId = consumoActual.id;
      readinRequest.novelty = consumoActual.title;

      const consumption: number =
        (readinRequest.currentReading ?? 0) -
        (readinRequest.previousReading ?? 0);

      const valueConsumoAgua: CalculateReadingValueModel =
        await this.calculateReadingValueUseCase.execute(
          readinRequest.cadastralKey,
          consumption,
        );

      const totalValue: number = valueConsumoAgua.total;

      readinRequest.readingValue = valueConsumoAgua.waterConsumptionValue;
      const sewerRateValue = valueConsumoAgua.sewerageValue;
      readinRequest.sewerRate = sewerRateValue;
      readinRequest.totalValue = totalValue;
      readinRequest.consumptionM3 = consumption;

      if (valueConsumoAgua.waterConsumptionValue < 0) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: `Error calculating total amount for reading with ID ${readingId}!`,
        });
      }

      const toUpdate: ReadingModel =
        ReadingMapper.fromUpdateReadingRequestToReadingModel(readinRequest);

      const updatedReading = new ReadingModel(
        toUpdate.id,
        toUpdate.connectionId,
        toUpdate.readingDate,
        toUpdate.readingTime,
        toUpdate.sector,
        toUpdate.account,
        toUpdate.cadastralKey,
        valueConsumoAgua.waterConsumptionValue,
        toUpdate.sewerRate,
        toUpdate.previousReading,
        toUpdate.currentReading,
        toUpdate.rentalIncomeCode,
        toUpdate.novelty,
        toUpdate.meterStatus,
        toUpdate.incomeCode,
        toUpdate.typeNoveltyReadingId,
        toUpdate.currentMonthReading,
        toUpdate.locationCapture,
        toUpdate.readingCode,
        consumption,
        totalValue,
      );

      //console.log(`Updated reading: ${JSON.stringify(updatedReading)}`);
      //console.log(`Reading ID: ${readingId}`);
      const updatedReadingEntity: ReadingModel | null =
        await this.readingRepository.updateCurrentReading(
          readingId,
          updatedReading,
          updateUserId,
          {
            lecturaId: readingId,
            tipoAjusteId: 1, // ACTUALIZACION_NORMAL
            lecturaAnteriorPrevia: null,
            lecturaAnteriorNueva: null,
            lecturaActualPrevia: null,
            lecturaActualNueva: updatedReading.currentReading,
            justificacion: 'Actualización Normal (desde App móvil o web)',
            usuarioId: updateUserId,
          },
        );

      if (updatedReadingEntity !== null) {
        await this.breakdownRecorder.record(readingId, valueConsumoAgua);
        return ReadingMapper.fromReadingModelToReadingResponse(
          updatedReadingEntity,
        );
      } else {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: `Error updating reading with ID ${readingId}!`,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  private CalculateSewerRate(readingValue: number): number {
    return readingValue * (40 / 100); // 40% of the reading value
  }
}
