import { ReadingModel } from './../schemas/model/reading.model';
import { ReadingBasicInfoResponse } from "../schemas/dto/response/reading-basic.response";
import { ReadingResponse } from '../schemas/dto/response/reading.response';

export interface InterfaceReadingRepository {
  findReadingBasicInfo(catastralCode: string): Promise<ReadingBasicInfoResponse[]>;
  updateCurrentReading(readingId: number, readingModel: ReadingModel): Promise<ReadingResponse | null>;
  verifyReadingIfExist(readingId: number): Promise<boolean>;
  createReading(readingModel: ReadingModel): Promise<ReadingResponse | null>;
}