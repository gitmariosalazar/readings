import { CreatePhotoReadingRequest } from '../dtos/request/create.photo-reading.request';
import { PhotoReadingResponse } from '../dtos/response/photo-reading.response';

export interface InterfacePhotoReadingUseCase {
  createPhotoReading(
    photoReading: CreatePhotoReadingRequest,
  ): Promise<PhotoReadingResponse | null>;
  getPhotoReadingsByCadastralKey(
    cadastralKey: string,
  ): Promise<PhotoReadingResponse[]>;
  getPhotoReadingsByReadingId(
    readingId: number,
  ): Promise<PhotoReadingResponse[]>;
}
