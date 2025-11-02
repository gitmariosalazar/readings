import { PhotoReadingResponse } from "../../../../domain/schemas/dto/response/photo-reading.response";
import { PhotoReadingSQLResponse } from "../../../interfaces/sql/photo-reading.sql.response";

export class PhotoReadingAdapter {
  static fromPhotoReadingResponseToSQL(photoReading: PhotoReadingResponse): PhotoReadingSQLResponse {
    return {
      photoReadingId: photoReading.photoReadingId,
      readingId: photoReading.readingId,
      photoUrl: photoReading.photoUrl,
      cadastralKey: photoReading.cadastralKey,
      description: photoReading.description,
      createdAt: photoReading.createdAt,
      updatedAt: photoReading.updatedAt,
    };
  }

  static fromPhotoReadingSQLResponseToPhotoReadingResponse(photoReading: PhotoReadingSQLResponse): PhotoReadingResponse {
    return {
      photoReadingId: photoReading.photoReadingId,
      readingId: photoReading.readingId,
      photoUrl: photoReading.photoUrl,
      cadastralKey: photoReading.cadastralKey,
      description: photoReading.description,
      createdAt: photoReading.createdAt,
      updatedAt: photoReading.updatedAt,
    };
  }
}