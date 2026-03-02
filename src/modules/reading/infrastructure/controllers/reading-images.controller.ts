import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetReadingImagesByMonthUseCase } from '../../application/usecases/queries/GetReadingImagesByMonthUseCase';
import { GetReadingImagesByMonthAndSectorUseCase } from '../../application/usecases/queries/GetReadingImagesByMonthAndSectorUseCase';
import { FindReadingImagesByCadastralKeyUseCase } from '../../application/usecases/queries/FindReadingImagesByCadastralKeyUseCase';
import { GetAllReadingImagesUseCase } from '../../application/usecases/queries/GetAllReadingImagesUseCase';

@Controller('ReadingImages')
export class ReadingImagesController {
  constructor(
    private readonly getReadingImagesByMonthUseCase: GetReadingImagesByMonthUseCase,
    private readonly getReadingImagesByMonthAndSectorUseCase: GetReadingImagesByMonthAndSectorUseCase,
    private readonly findReadingImagesByCadastralKeyUseCase: FindReadingImagesByCadastralKeyUseCase,
    private readonly findAllReadingImagesUseCase: GetAllReadingImagesUseCase,
  ) {}

  @Get('find-reading-images-by-month')
  @MessagePattern('reading.find-reading-images-by-month')
  async findReadingImagesByMonth(@Payload() data: { month: string }) {
    return this.getReadingImagesByMonthUseCase.execute(data.month);
  }

  @Get('find-reading-images-by-month-and-sector')
  @MessagePattern('reading.find-reading-images-by-month-and-sector')
  async findReadingImagesByMonthAndSector(
    @Payload() data: { month: string; sector: number },
  ) {
    return this.getReadingImagesByMonthAndSectorUseCase.execute(
      data.month,
      data.sector,
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
