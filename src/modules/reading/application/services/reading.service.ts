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
import { MONTHS } from 'src/shared/consts/months';
import { toZonedTime } from 'date-fns-tz';
import { INovelty, LOWER_ALERT_FACTOR, LOWER_NORMAL_FACTOR, NOVELTIES, UPPER_ALERT_FACTOR, UPPER_NORMAL_FACTOR } from '../usecases/novelty.interface';
import { InterfaceObservationReadingRepository } from 'src/modules/observations/domain/contracts/observation-reading.interface.repository';
import { CreateObservationReadingRequest } from 'src/modules/observations/domain/schemas/dto/request/create-observatio-reading.request';
import { ObservationReadingMapper } from 'src/modules/observations/application/mappers/observation-reading.mapper';
import { ObservationReadingModel } from 'src/modules/observations/domain/schemas/model/observation-reading.model';
import { getNoveltyById } from 'src/shared/types/novelty.type';

@Injectable()
export class ReadingUseCaseService implements InterfaceReadingUseCase {
  constructor(
    @Inject('ReadingRepository')
    private readonly readingRepository: InterfaceReadingRepository,
    @Inject('ObservationReadingRepository')
    private readonly observationRepository: InterfaceObservationReadingRepository,
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
        'previousReading',
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

  /**
     * Determines the type of consumption novelty based on the current and previous readings compared to the average.
     * @param previousReading - The previous meter reading (in m3).
     * @param currentReading - The current meter reading (in m3).
     * @param average - The average consumption (in m3).
     * @returns An object containing the novelty ID, title, and description.
     * @throws Error if the input values are invalid.
     */
  private getTypeCurrentConsumption(previousReading: number, currentReading: number, average: number): INovelty {
    if (!Number.isFinite(previousReading) || !Number.isFinite(currentReading) || !Number.isFinite(average)) {
      throw new Error('Invalid input: readings and average must be finite numbers');
    }
    if (previousReading < 0 || currentReading < 0 || average < 0) {
      throw new Error('Invalid input: readings and average cannot be negative');
    }
    if (currentReading < previousReading) {
      throw new Error('Invalid input: current reading cannot be less than previous reading');
    }

    const currentConsumption: number = currentReading - previousReading;
    const lowerNormal: number = average * LOWER_NORMAL_FACTOR;
    const upperNormal: number = average * UPPER_NORMAL_FACTOR;
    const lowerAlert: number = average * LOWER_ALERT_FACTOR;
    const upperAlert: number = average * UPPER_ALERT_FACTOR;

    let novelty: INovelty = {
      id: 1,
      title: NOVELTIES[1].title,
      description: 'NORMAL',
    };

    if (currentConsumption >= lowerNormal && currentConsumption <= upperNormal) {
      // Normal
      novelty = { id: 1, title: NOVELTIES[1].title, description: 'NORMAL' };
    } else if ((currentConsumption >= lowerAlert && currentConsumption < lowerNormal) ||
      (currentConsumption > upperNormal && currentConsumption <= upperAlert)) {
      // Warning
      novelty = {
        id: 2,
        title: NOVELTIES[2].title,
        description: currentConsumption < lowerNormal
          ? `WARNING: Consumption is below normal. Average consumption is ${average} m3, but current consumption is ${currentConsumption} m3.`
          : `WARNING: Consumption is above normal. Average consumption is ${average} m3, but current consumption is ${currentConsumption} m3.`,
      };
    } else if (currentConsumption < lowerAlert || currentConsumption > upperAlert) {
      // Danger
      novelty = {
        id: 3,
        title: NOVELTIES[3].title,
        description: currentConsumption < lowerAlert
          ? `DANGER: Consumption is significantly below normal. Average consumption is ${average} m3, but current consumption is ${currentConsumption} m3. Please verify the meter, reading or possible leaks.`
          : `DANGER: Consumption is significantly above normal. Average consumption is ${average} m3, but current consumption is ${currentConsumption} m3. Please verify the meter, reading or possible leaks.`,
      };
    }

    return novelty;
  }

  /**
   * Creates a new reading record and processes any associated novelties.
   * @param readingRequest - The request object containing reading details.
   * @returns The created reading response or null if creation fails.
   * @throws RpcException if validation fails or an error occurs during processing.
   */
  async createReading(readingRequest: CreateReadingRequest): Promise<ReadingResponse | null> {
    try {
      const requiredFields: string[] = [
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
      ];
      const missingFieldMessages: string[] = validateFields(readingRequest, requiredFields);

      if (missingFieldMessages.length > 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: missingFieldMessages,
        });
      }

      // Validar tipos y valores
      if (typeof readingRequest.currentReading !== 'number' || readingRequest.currentReading < 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'currentReading must be a non-negative number',
        });
      }
      if (typeof readingRequest.previousReading !== 'number' || readingRequest.previousReading < 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'previousReading must be a non-negative number',
        });
      }
      if (readingRequest.averageConsumption === undefined || readingRequest.averageConsumption < 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'averageConsumption must be a non-negative number',
        });
      }

      // Procesar fecha y hora
      const now: Date = new Date();
      const hour: string = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'America/Guayaquil',
      }).format(now);
      const formatDate: Date = toZonedTime(now, 'America/Guayaquil');
      readingRequest.readingTime = hour;
      readingRequest.readingDate = formatDate;

      const currentConsumption: INovelty = this.getTypeCurrentConsumption(
        readingRequest.previousReading,
        readingRequest.currentReading,
        readingRequest.averageConsumption,
      );

      readingRequest.typeNoveltyReadingId = currentConsumption.id;
      readingRequest.novelty = currentConsumption.title;

      const toCreate: ReadingModel = ReadingMapper.fromCreateReadingRequestToReadingModel(readingRequest);
      const created: ReadingResponse | null = await this.readingRepository.createReading(toCreate);

      if (created === null) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Error creating new reading record!',
        });
      }

      if (currentConsumption.id !== 1) {
        created.novelty = NOVELTIES[currentConsumption.id].title;
        const observationRequest: CreateObservationReadingRequest = {
          readingId: created.readingId,
          observationTitle: `NOVELTY DETECTED IN READING ID ${created.readingId}`,
          observationDetails: currentConsumption.description,
        };
        const observationModel: ObservationReadingModel = ObservationReadingMapper.fromCreateObservationReadingToModel(observationRequest);
        const createdObservation = await this.observationRepository.createObservationReading(observationModel);

        if (createdObservation === null) {
          throw new RpcException({
            statusCode: statusCode.INTERNAL_SERVER_ERROR,
            message: `Error creating observation for reading with ID ${created.readingId}!`,
          });
        }
      }

      return created;
    } catch (error) {
      const errorMessage = error instanceof RpcException
        ? error.message
        : `Unexpected error while creating reading: ${error.message}`;
      console.error(errorMessage, error);
      throw error;
    }
  }

  /*
    async createReading(
      readingRequest: CreateReadingRequest,
    ): Promise<ReadingResponse | null> {
      try {
  
        const requiredFields: string[] = ['connectionId', 'sewerRate', 'previousReading', 'incomeCode', 'cadastralKey', 'account', 'sector', 'readingValue', 'currentReading', 'rentalIncomeCode'];
        const missingFieldMessages: string[] = validateFields(readingRequest, requiredFields);
  
        if (missingFieldMessages.length > 0) {
          throw new RpcException({
            statusCode: statusCode.BAD_REQUEST,
            message: missingFieldMessages
          });
        }
  
        const now: Date = new Date();
        const hour: string = new Intl.DateTimeFormat('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: 'America/Guayaquil'
        }).format(now);
        const formatDate: Date = toZonedTime(now, 'America/Guayaquil');
        readingRequest.readingTime = hour;
        readingRequest.readingDate = formatDate;
        readingRequest.readingTime = hour;
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
  
        const currentConsumption: INovelty = await this.getTypeCurrentConsumption(
          readingRequest.previousReading ?? 0,
          readingRequest.currentReading ?? 0,
          readingRequest.averageConsumption ?? 0,
        );
  
        readingRequest.typeNoveltyReadingId = currentConsumption.id;
        readingRequest.novelty = currentConsumption.title;
        if (currentConsumption.id !== 1) {
          created.novelty = getNoveltyById(currentConsumption.id).title;
          const observationRequest: CreateObservationReadingRequest = {
            readingId: created.readingId,
            observationTitle: `NOVELTY DETECTED IN READING ID ${created.readingId}`,
            observationDetails: currentConsumption.description
          }
          const observationModel: ObservationReadingModel = ObservationReadingMapper.fromCreateObservationReadingToModel(observationRequest);
          const createdObservation = await this.observationRepository.createObservationReading(observationModel);
          if (createdObservation === null) {
            throw new RpcException({
              statusCode: statusCode.INTERNAL_SERVER_ERROR,
              message: `Error creating observation for reading with ID ${created.readingId}!`,
            });
          }
        }
  
        return created;
      } catch (error) {
        throw error;
      }
    }
      */

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
