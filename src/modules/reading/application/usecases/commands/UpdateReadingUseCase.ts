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

@Injectable()
export class UpdateReadingUseCase {
  constructor(
    @Inject('ReadingRepository')
    private readonly readingRepository: InterfaceReadingRepository,
    @Inject('NoveltyRepository')
    private readonly noveltyRepository: InterfaceNoveltyRepository,
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

      const baseValue: number = 0;
      const consumption: number =
        (readinRequest.currentReading ?? 0) -
        (readinRequest.previousReading ?? 0);
      const totalAmount: number = parseFloat(
        (consumption * baseValue).toFixed(2),
      );

      if (totalAmount < 0) {
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
        totalAmount,
        toUpdate.sewerRate,
        toUpdate.previousReading,
        toUpdate.currentReading,
        toUpdate.rentalIncomeCode,
        toUpdate.novelty,
        toUpdate.incomeCode,
        toUpdate.typeNoveltyReadingId,
        toUpdate.currentMonthReading,
        toUpdate.locationCapture,
      );

      //console.log(`Updated reading: ${JSON.stringify(updatedReading)}`);
      //console.log(`Reading ID: ${readingId}`);
      const updatedReadingEntity: ReadingModel | null =
        await this.readingRepository.updateCurrentReading(
          readingId,
          updatedReading,
          updateUserId,
        );

      if (updatedReadingEntity !== null) {
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
}
