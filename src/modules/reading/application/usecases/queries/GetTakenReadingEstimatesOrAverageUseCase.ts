import { Inject, Injectable } from '@nestjs/common';
import { InterfaceReadingRepository } from '../../../domain/contracts/reading.interface.repository';
import { ReadingMapper } from '../../mappers/reading.mapper';
import { TakenReadingConnectionResponse } from '../../dtos/response/reading.response';
import { statusCode } from '../../../../../settings/environments/status-code';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class GetTakenReadingEstimatesOrAverageUseCase {
  constructor(
    @Inject('ReadingRepository')
    private readonly readingRepository: InterfaceReadingRepository,
  ) {}

  async execute(
    month: string,
    sector?: number,
    userId?: string,
    date?: string,
  ): Promise<TakenReadingConnectionResponse[]> {
    if (!month) {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: `Month is required`,
      });
    }

    const takenReadings =
      await this.readingRepository.getTakenReadingEstimatesOrAverage(
        month,
        sector,
        userId,
        date,
      );
    return takenReadings.map((takenReading) =>
      ReadingMapper.fromTakenReadingConnectionModelToTakenReadingConnectionResponse(
        takenReading,
      ),
    );
  }
}
