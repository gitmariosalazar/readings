import { PhotoReadingModel } from '../../domain/schemas/model/photo-reading.model';
import { PhotoReadingSQLResponse } from '../interfaces/sql/photo-reading.sql.response';

export class PhotoReadingAdapter {
  static fromPhotoReadingSQLResponseToPhotoReadingModel(
    photoReading: PhotoReadingSQLResponse,
  ): PhotoReadingModel {
    const model = new PhotoReadingModel(
      photoReading.reading_id,
      photoReading.photo_url,
      photoReading.cadastral_key,
      photoReading.description,
      photoReading.photo_reading_id,
      photoReading.created_at,
      photoReading.updated_at,
    );
    return model;
  }
}
