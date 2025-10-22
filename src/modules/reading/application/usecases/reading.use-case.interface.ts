import { CreateReadingRequest } from "../../domain/schemas/dto/request/create-reading.request";
import { UpdateReadingRequest } from "../../domain/schemas/dto/request/update-reading.request";
import { ReadingBasicInfoResponse } from "../../domain/schemas/dto/response/reading-basic.response";
import { ReadingResponse } from "../../domain/schemas/dto/response/reading.response";

export interface InterfaceReadingUseCase {
  findReadingBasicInfo(catastralCode: string): Promise<ReadingBasicInfoResponse[]>;
  updateCurrentReading(readingId: number, readinRequest: UpdateReadingRequest): Promise<ReadingResponse | null>;
  verifyReadingIfExist(readingId: number): Promise<boolean>;
  createReading(readingRequest: CreateReadingRequest): Promise<ReadingResponse | null>;
}