import { Inject, Injectable } from '@nestjs/common';
import { InterfaceReadingRepository } from '../../../domain/contracts/reading.interface.repository';
import { PendingReadingConnectionModel } from '../../../domain/schemas/model/pending-reading-connection.model';
import { ReadingMapper } from '../../mappers/reading.mapper';
import { statusCode } from '../../../../../settings/environments/status-code';
import { RpcException } from '@nestjs/microservices';
import { PendingReadingConnectionResponse } from '../../dtos/response/reading.response';

@Injectable()
export class GetPendingReadingsByMonthUseCase {
  constructor(
    @Inject('ReadingRepository')
    private readonly readingRepository: InterfaceReadingRepository,
  ) {}

  async execute(
    month: string,
    sector?: number,
  ): Promise<PendingReadingConnectionResponse[]> {
    if (!month) {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: `Month is required`,
      });
    }

    const pendingReadings =
      await this.readingRepository.getPendingReadingsByMonth(month, sector);
    return pendingReadings.map((pendingReading) =>
      ReadingMapper.fromPendingReadingConnectionModelToPendingReadingConnectionResponse(
        pendingReading,
      ),
    );
  }
}
