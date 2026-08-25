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
import { UUID } from 'crypto';
import { GetReadingByNoveltyUseCase } from '../../application/usecases/queries/GetReadingByNoveltyUseCase';
import { FindAllNoveltiesUseCase } from '../../application/usecases/novelties/FindAllNoveltiesUseCase';
import { GetMapGeojsonByDayAndByUserUseCase } from '../../application/usecases/queries/GetMapGeojsonByDayAndByUserUseCase';
import { GetDetailedReadingInfoByCadastralKeyUseCase } from '../../application/usecases/queries/GetDetailedReadingInfoByCadastralKeyUseCase';

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
    private readonly getReadingByNoveltyUseCase: GetReadingByNoveltyUseCase,
    private readonly findAllNoveltiesUseCase: FindAllNoveltiesUseCase,
    private readonly getMapGeojsonByDayAndByUserUseCase: GetMapGeojsonByDayAndByUserUseCase,
    private readonly getDetailedReadingInfoByCadastralKeyUseCase: GetDetailedReadingInfoByCadastralKeyUseCase,
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
      updateUserId: UUID;
    },
  ) {
    return this.updateReadingUseCase.execute(
      data.readingId,
      data.readingRequest,
      data.updateUserId,
    );
  }

  @Post('create-reading')
  @MessagePattern('reading.create-reading')
  async createReading(
    @Payload() payload: CreateReadingRequest & { creatorUserId: UUID },
  ) {
    const { creatorUserId, ...readingRequest } = payload;
    return this.createReadingUseCase.execute(readingRequest, creatorUserId);
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
    @Payload() data: { month: string; sector?: number; userId?: string },
  ) {
    return this.getTakenReadingEstimatesOrAverageUseCase.execute(
      data.month,
      data.sector,
      data.userId,
    );
  }

  @Get('get-taken-readings-by-month')
  @MessagePattern('reading.get-taken-readings-by-month')
  async getTakenReadingsByMonth(
    @Payload() data: { month: string; sector?: number; userId?: string },
  ) {
    return this.getTakenReadingsByMonthUseCase.execute(
      data.month,
      data.sector,
      data.userId,
    );
  }

  @Get('get-reading-by-novelty')
  @MessagePattern('reading.get-reading-by-novelty')
  async getReadingByNovelty(
    @Payload()
    data: {
      month: string;
      novelty?: string;
      sector?: number;
      userId?: string;
    },
  ) {
    const { month, novelty, sector, userId } = data;
    return this.getReadingByNoveltyUseCase.execute(
      month,
      novelty,
      sector,
      userId,
    );
  }

  @Get('find-all-novelties')
  @MessagePattern('reading.find-all-novelties')
  async findAllNovelties() {
    return this.findAllNoveltiesUseCase.execute();
  }

  @Get('get-map-geojson-by-day-and-by-user')
  @MessagePattern('reading.get-map-geojson-by-day-and-by-user')
  async getMapGeojsonByDayAndByUser(
    @Payload() data: { date: string; userId?: string },
  ) {
    return this.getMapGeojsonByDayAndByUserUseCase.execute(
      data.date,
      data.userId,
    );
  }

  @Get('get-detailed-reading-info-by-cadastral-key')
  @MessagePattern('reading.get-detailed-reading-info-by-cadastral-key')
  async getDetailedReadingInfoByCadastralKey(
    @Payload() data: { cadastralKey: string; yearAndMonth: string },
  ) {
    return this.getDetailedReadingInfoByCadastralKeyUseCase.execute(
      data.cadastralKey,
      data.yearAndMonth,
    );
  }
}
