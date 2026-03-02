import { Controller, Get, Post, Put } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UpdateReadingRequest } from '../../application/dtos/request/update-reading.request';
import { CreateReadingRequest } from '../../application/dtos/request/create-reading.request';
import { CreateReadingUseCase } from '../../application/usecases/commands/CreateReadingUseCase';
import { UpdateReadingUseCase } from '../../application/usecases/commands/UpdateReadingUseCase';
import { FindReadingUseCase } from '../../application/usecases/queries/FindReadingUseCase';
import { FindBasicReadingUseCase } from '../../application/usecases/queries/FindBasicReadingUseCase';
import { FindReadingHistoryByCadastralKeyUseCase } from '../../application/usecases/queries/FindReadingHistoryByCadastralKeyUseCase';
import { GetPendingReadingsByMonthUseCase } from '../../application/usecases/queries/GetPendingReadingsByMonthUseCase';
import { GetTakenReadingsByMonthUseCase } from '../../application/usecases/queries/GetTakenReadingsByMonthUseCase';
import { GetTakenReadingEstimatesOrAverageUseCase } from '../../application/usecases/queries/GetTakenReadingEstimatesOrAverageUseCase';

@Controller('Readings')
export class ReadingController {
  constructor(
    private readonly createReadingUseCase: CreateReadingUseCase,
    private readonly updateReadingUseCase: UpdateReadingUseCase,
    private readonly findReadingUseCase: FindReadingUseCase,
    private readonly findBasicReadingUseCase: FindBasicReadingUseCase,
    private readonly findReadingHistoryUseCase: FindReadingHistoryByCadastralKeyUseCase,
    private readonly getPendingReadingsByMonthUseCase: GetPendingReadingsByMonthUseCase,
    private readonly getTakenReadingEstimatesOrAverageUseCase: GetTakenReadingEstimatesOrAverageUseCase,
    private readonly getTakenReadingsByMonthUseCase: GetTakenReadingsByMonthUseCase,
  ) {}

  @Get('find-basic-reading/:catastralCode')
  @MessagePattern('reading.find-basic-reading')
  async findBasicReadingByCatastralCode(@Payload() catastralCode: string) {
    return this.findBasicReadingUseCase.execute(catastralCode);
  }

  @Put('update-current-reading/:readingId')
  @MessagePattern('reading.update-current-reading')
  async updateCurrentReading(
    @Payload()
    data: {
      readingId: number;
      readingRequest: UpdateReadingRequest;
    },
  ) {
    return this.updateReadingUseCase.execute(
      data.readingId,
      data.readingRequest,
    );
  }

  @Post('create-reading')
  @MessagePattern('reading.create-reading')
  async createReading(@Payload() readingRequest: CreateReadingRequest) {
    return this.createReadingUseCase.execute(readingRequest);
  }

  @Get('find-reading-info/:cadastralKey')
  @MessagePattern('reading.find-reading-info')
  async findReadingInfoByCadastralKey(@Payload() cadastralKey: string) {
    return this.findReadingUseCase.execute(cadastralKey);
  }

  @Get('find-reading-history/:cadastralKey')
  @MessagePattern('reading.find-reading-history')
  async findReadingHistoryByCadastralKey(
    @Payload()
    data: {
      cadastralKey: string;
      limit: number;
      offset: number;
    },
  ) {
    return this.findReadingHistoryUseCase.execute(
      data.cadastralKey,
      data.limit,
      data.offset,
    );
  }

  @Get('get-pending-readings-by-month')
  @MessagePattern('reading.get-pending-readings-by-month')
  async getPendingReadingsByMonth(
    @Payload() data: { month: string; sector?: number },
  ) {
    return this.getPendingReadingsByMonthUseCase.execute(
      data.month,
      data.sector,
    );
  }

  @Get('get-taken-reading-estimates-or-average')
  @MessagePattern('reading.get-taken-reading-estimates-or-average')
  async getTakenReadingEstimatesOrAverage(
    @Payload() data: { month: string; sector?: number },
  ) {
    return this.getTakenReadingEstimatesOrAverageUseCase.execute(
      data.month,
      data.sector,
    );
  }

  @Get('get-taken-readings-by-month')
  @MessagePattern('reading.get-taken-readings-by-month')
  async getTakenReadingsByMonth(
    @Payload() data: { month: string; sector?: number },
  ) {
    return this.getTakenReadingsByMonthUseCase.execute(data.month, data.sector);
  }
}
