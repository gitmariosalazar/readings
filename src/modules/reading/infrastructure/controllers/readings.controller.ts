import { Controller, Get, Put } from "@nestjs/common";
import { ReadingUseCaseService } from "../../application/services/reading.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { UpdateReadingRequest } from "../../domain/schemas/dto/request/update-reading.request";

@Controller('Readings')
export class ReadingController {
  constructor(
    private readonly readingService: ReadingUseCaseService
  ) { }

  @Get('find-basic-reading/:catastralCode')
  @MessagePattern('reading.find-basic-reading')
  async findBasicReadingByCatastralCode(@Payload() catastralCode: string) {
    return this.readingService.findReadingBasicInfo(catastralCode);
  }

  @Put('update-current-reading/:readingId')
  @MessagePattern('reading.update-current-reading')
  async updateCurrentReading(@Payload() data: { readingId: number, readingRequest: UpdateReadingRequest }) {
    return this.readingService.updateCurrentReading(data.readingId, data.readingRequest);
  }
}