import { Inject, Injectable } from '@nestjs/common';
import { InterfaceReadingUseCase } from '../usecases/reading.use-case.interface';
import { InterfaceReadingRepository } from '../../domain/contracts/reading.interface.repository';
import { ReadingBasicInfoResponse } from '../../domain/schemas/dto/response/reading-basic.response';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from 'src/settings/environments/status-code';
import { UpdateReadingRequest } from '../../domain/schemas/dto/request/update-reading.request';
import { ReadingResponse } from '../../domain/schemas/dto/response/reading.response';
import { validateFields } from 'src/shared/validators/fields.validators';
import { ReadingModel } from '../../domain/schemas/model/reading.model';
import { ReadingMapper } from '../mappers/reading.mapper';
import { CreateReadingRequest } from '../../domain/schemas/dto/request/create-reading.request';

@Injectable()
export class ReadingUseCaseService implements InterfaceReadingUseCase {
  constructor(
    @Inject('ReadingRepository')
    private readonly readingRepository: InterfaceReadingRepository,
  ) { }

  async verifyReadingIfExist(readingId: number): Promise<boolean> {
    try {
      if (!readingId || isNaN(readingId)) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: `Parameter readingId is required!`,
        });
      }
      return this.readingRepository.verifyReadingIfExist(readingId);
    } catch (error) {
      throw error;
    }
  }

  async updateCurrentReading(
    readingId: number,
    readinRequest: UpdateReadingRequest,
  ): Promise<ReadingResponse | null> {
    try {
      const requiredFields: string[] = [
        'previewsReading',
        'currentReading',
        'rentalIncomeCode',
        'novelty',
        'incomeCode',
        'cadastralKey',
        'connectionId',
        'account',
        'sector',
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

      if (readinRequest.currentReading! < readinRequest.previousReading!) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: `The current reading cannot be less than the previous reading!`,
        });
      }

      if (readinRequest.currentReading === readinRequest.previousReading) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: `The current reading cannot be equal to the previous reading!`,
        });
      }

      const baseValue: number = 4.56;
      const consumption: number =
        (readinRequest.currentReading ?? 0) -
        (readinRequest.previousReading ?? 0);
      const totalAmount: number = parseFloat(
        (consumption * baseValue).toFixed(2),
      );

      if (totalAmount <= 0) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: `Error calculating total amount for reading with ID ${readingId}!`,
        });
      }

      const toUpdate: ReadingModel =
        ReadingMapper.fromUpdateReadingRequestToReadingModel(readinRequest);
      toUpdate.setReadingValue(totalAmount);
      const updated: ReadingResponse | null =
        await this.readingRepository.updateCurrentReading(readingId, toUpdate);

      if (updated !== null) {
        const createRequest: CreateReadingRequest = new CreateReadingRequest();
        createRequest.connectionId = readinRequest.connectionId;
        createRequest.cadastralKey = readinRequest.cadastralKey;
        createRequest.incomeCode = readinRequest.incomeCode ?? 0;
        createRequest.account = readinRequest.account;
        createRequest.previousReading = readinRequest.currentReading ?? 0;
        createRequest.sector = readinRequest.sector;
        createRequest.sewerRate = readinRequest.sewerRate ?? 0;

        const modelToCreate: ReadingModel =
          ReadingMapper.fromCreateReadingRequestToReadingModel(createRequest);
        const created =
          await this.readingRepository.createReading(modelToCreate);

        if (created === null) {
          throw new RpcException({
            statusCode: statusCode.INTERNAL_SERVER_ERROR,
            message: `Error creating new reading record!`,
          });
        }
        return updated;
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

  async createReading(
    readingRequest: CreateReadingRequest,
  ): Promise<ReadingResponse | null> {
    try {
      /*
      const requiredFields: string[] = ['readingId', 'sewerRate', 'previewsReading', 'incomeCode', 'cadastralKey', 'account', 'sector'];
      const missingFieldMessages: string[] = validateFields(readingRequest, requiredFields);

      if (missingFieldMessages.length > 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: missingFieldMessages
        });
      }
      */
      const toCreate: ReadingModel =
        ReadingMapper.fromCreateReadingRequestToReadingModel(readingRequest);
      const created: ReadingResponse | null =
        await this.readingRepository.createReading(toCreate);

      if (created === null) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: `Error creating new reading record!`,
        });
      }
      return created;
    } catch (error) {
      throw error;
    }
  }

  async findReadingBasicInfo(
    catastralCode: string,
  ): Promise<ReadingBasicInfoResponse[]> {
    try {
      if (catastralCode.trim().length === 0 || !catastralCode) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: `Parameter catastralCode is required!`,
        });
      }
      const readingFound: ReadingBasicInfoResponse[] =
        await this.readingRepository.findReadingBasicInfo(catastralCode);

      if (readingFound.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `Data not found for connection with ID: ${catastralCode}`,
        });
      }
      return readingFound;
    } catch (error) {
      throw error;
    }
  }
}
