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
import { InterfacePhotoReadingRepository } from '../../../../images-readings/domain/contracts/photo-reading.interface.repository';
import { PhotoReadingMapper } from '../../../../images-readings/application/mappers/photo-reading.mapper';
import { PhotoReadingModel } from '../../../../images-readings/domain/schemas/model/photo-reading.model';
import { CreatePhotoReadingRequest } from '../../../../images-readings/application/dtos/request/create.photo-reading.request';

@Injectable()
export class UpdateSpecialReadingUseCase {
  constructor(
    @Inject('ReadingRepository')
    private readonly readingRepository: InterfaceReadingRepository,
    @Inject('NoveltyRepository')
    private readonly noveltyRepository: InterfaceNoveltyRepository,
    @Inject('PhotoReadingRepository')
    private readonly photoReadingRepository: InterfacePhotoReadingRepository,
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

      const photoInputs =
        request.photos ?? request.evidencePhotos ?? request.images ?? [];
      for (const item of photoInputs) {
        const url = typeof item === 'string' ? item : item?.photoUrl;
        if (!url || typeof url !== 'string' || url.trim() === '') {
          throw new RpcException({
            statusCode: statusCode.BAD_REQUEST,
            message:
              'Cada foto de evidencia debe contener una URL válida (photoUrl)',
          });
        }
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
        const response: ReadingResponse =
          ReadingMapper.fromReadingModelToReadingResponse(updatedReadingEntity);

        if (photoInputs.length > 0) {
          const savedPhotoModels: PhotoReadingModel[] = [];
          for (const item of photoInputs) {
            const photoUrl =
              typeof item === 'string' ? item.trim() : item.photoUrl.trim();
            const description =
              typeof item === 'string' ? undefined : item.description;

            const createPhotoReq = new CreatePhotoReadingRequest(
              readingId,
              photoUrl,
              request.cadastralKey,
              description ||
                `Foto de evidencia de lectura especial ID: ${readingId}`,
            );

            const photoModel: PhotoReadingModel =
              PhotoReadingMapper.fromCreatePhotoReadingRequestToPhotoReadingModel(
                createPhotoReq,
              );

            const createdPhotoModel =
              await this.photoReadingRepository.createPhotoReading(photoModel);

            if (createdPhotoModel) {
              savedPhotoModels.push(createdPhotoModel);
            }
          }

          if (savedPhotoModels.length > 0) {
            response.photos =
              PhotoReadingMapper.fromPhotoReadingModelsToPhotoReadingResponses(
                savedPhotoModels,
              );
          }
        }

        return response;
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
