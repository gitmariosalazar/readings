import { PhotoReadingModel } from '../schemas/model/photo-reading.model';

export interface InterfacePhotoReadingRepository {
  createPhotoReading(
    photoReading: PhotoReadingModel,
  ): Promise<PhotoReadingModel | null>;
  getPhotoReadingsByCadastralKey(
    cadastralKey: string,
  ): Promise<PhotoReadingModel[]>;
  getPhotoReadingsByReadingId(readingId: number): Promise<PhotoReadingModel[]>;
}
