import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { UpdateSpecialReadingRequest } from '../../dtos/request/update-special-reading.request';
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

@Injectable()
export class UpdateSpecialReadingUseCase {
  constructor(
    @Inject('ReadingRepository')
    private readonly readingRepository: InterfaceReadingRepository,
    @Inject('NoveltyRepository')
    private readonly noveltyRepository: InterfaceNoveltyRepository,
  ) {}

  async execute(
    readingId: number,
    request: UpdateSpecialReadingRequest,
    updateUserId: UUID,
  ): Promise<ReadingResponse | null> {
    try {
      const requiredFields: string[] = [
        'tipoAjusteId',
        'justificacion',
        'previousReading',
        'currentReading',
        'averageConsumption',
        'cadastralKey',
      ];
      const missingFieldMessages: string[] = validateFields(
        request,
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

      if (
        typeof request.currentReading !== 'number' ||
        request.currentReading < 0
      ) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'currentReading debe ser un número no negativo',
        });
      }
      if (
        typeof request.previousReading !== 'number' ||
        request.previousReading < 0
      ) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'previousReading debe ser un número no negativo',
        });
      }
      if (
        request.averageConsumption === undefined ||
        request.averageConsumption! < 0
      ) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'averageConsumption debe ser un número no negativo',
        });
      }

      if (request.currentReading! < request.previousReading!) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: `The current reading cannot be less than the previous reading!`,
        });
      }

      const novelties = await this.noveltyRepository.findAllNovelties();

      const consumoActual: NoveltyModel = getTypeCurrentConsumption(
        request.previousReading,
        request.currentReading,
        request.averageConsumption!,
        novelties,
      );

      request.typeNoveltyReadingId = consumoActual.id;
      request.novelty = consumoActual.title;

      const consumption: number =
        (request.currentReading ?? 0) - (request.previousReading ?? 0);

      const valueConsumoAgua =
        await this.readingRepository.calculateReadingValue(
          request.cadastralKey,
          consumption,
        );

      request.readingValue = valueConsumoAgua;
      const sewerRateValue = this.CalculateSewerRate(valueConsumoAgua);
      request.sewerRate = sewerRateValue;

      if (valueConsumoAgua < 0) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: `Error calculating total amount for reading with ID ${readingId}!`,
        });
      }

      const updatedReading = new ReadingModel(
        readingId,
        'UNKNOWN', // connectionId
        new Date(), // readingDate
        '00:00', // readingTime
        1, // sector
        1, // account
        request.cadastralKey, // cadastralKey
        valueConsumoAgua,
        sewerRateValue,
        request.previousReading!,
        request.currentReading!,
        1, // rentalIncomeCode
        request.novelty,
        1, // incomeCode
        request.typeNoveltyReadingId ?? 1,
        'UNKNOWN',
        null,
        '1',
      );

      const auditData = {
        lecturaId: readingId,
        tipoAjusteId: request.tipoAjusteId,
        lecturaAnteriorPrevia: null, // Will be filled in repository
        lecturaAnteriorNueva: request.previousReading,
        lecturaActualPrevia: null, // Will be filled in repository
        lecturaActualNueva: request.currentReading,
        justificacion: request.justificacion,
        usuarioId: updateUserId,
      };

      const updatedReadingEntity: ReadingModel | null =
        await this.readingRepository.updateSpecialReading(
          readingId,
          updatedReading,
          auditData,
        );

      if (updatedReadingEntity !== null) {
        return ReadingMapper.fromReadingModelToReadingResponse(
          updatedReadingEntity,
        );
      } else {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: `Error special updating reading with ID ${readingId}!`,
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
