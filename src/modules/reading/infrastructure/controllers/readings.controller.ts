import { Controller, Get, Post, Put } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UpdateReadingRequest } from '../../application/dtos/request/update-reading.request';
import { CreateReadingRequest } from '../../application/dtos/request/create-reading.request';
import { CreateReadingUseCase } from '../../application/usecases/commands/CreateReadingUseCase';
import { UpdateReadingUseCase } from '../../application/usecases/commands/UpdateReadingUseCase';
import { FindReadingUseCase } from '../../application/usecases/queries/FindReadingUseCase';
import { FindBasicReadingUseCase } from '../../application/usecases/queries/FindBasicReadingUseCase';
import { FindReadingHistoryByCadastralKeyUseCase } from '../../application/usecases/queries/FindReadingHistoryByCadastralKeyUseCase';
import { GetAllReadingImagesUseCase } from '../../application/usecases/queries/GetAllReadingImagesUseCase';
import { FindReadingImagesByCadastralKeyUseCase } from '../../application/usecases/queries/FindReadingImagesByCadastralKeyUseCase';

@Controller('Readings')
export class ReadingController {
  constructor(
    private readonly createReadingUseCase: CreateReadingUseCase,
    private readonly updateReadingUseCase: UpdateReadingUseCase,
    private readonly findReadingUseCase: FindReadingUseCase,
    private readonly findBasicReadingUseCase: FindBasicReadingUseCase,
    private readonly findReadingHistoryUseCase: FindReadingHistoryByCadastralKeyUseCase,
    private readonly findAllReadingImagesUseCase: GetAllReadingImagesUseCase,
    private readonly findReadingImagesByCadastralKeyUseCase: FindReadingImagesByCadastralKeyUseCase,
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

  @Get('find-reading-images/:cadastralKey')
  @MessagePattern('reading.find-readings-image-by-cadastral-key')
  async findReadingImagesByCadastralKey(@Payload() cadastralKey: string) {
    return this.findReadingImagesByCadastralKeyUseCase.execute(cadastralKey);
  }

  @Get('find-all-reading-images')
  @MessagePattern('reading.find-all-reading-images')
  async findAllReadingImages() {
    return this.findAllReadingImagesUseCase.execute();
  }
}
