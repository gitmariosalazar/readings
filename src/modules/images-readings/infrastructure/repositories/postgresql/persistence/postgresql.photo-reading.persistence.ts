import { Injectable } from "@nestjs/common";
import { PhotoReadingSQLResponse } from "../../../interfaces/sql/photo-reading.sql.response";
import { PhotoReadingAdapter } from "../adapters/photo-reading.adapter";
import { RpcException } from "@nestjs/microservices";
import { InterfacePhotoReadingRepository } from "../../../../domain/contracts/photo-reading.interface.repository";
import { DatabaseServicePostgreSQL } from "../../../../../../shared/connections/database/postgresql/postgresql.service";
import { PhotoReadingModel } from "../../../../domain/schemas/model/photo-reading.model";
import { PhotoReadingResponse } from "../../../../domain/schemas/dto/response/photo-reading.response";
import { statusCode } from "../../../../../../settings/environments/status-code";

@Injectable()
export class PhotoReadingPostgreSQLPersistence implements InterfacePhotoReadingRepository {
  constructor(
    private readonly postgreSQLService: DatabaseServicePostgreSQL
  ) { }

  async createPhotoReading(photoReading: PhotoReadingModel): Promise<PhotoReadingResponse | null> {
    try {

      const query = `
        INSERT INTO fotolectura (lecturaid, imagenurl, clavecatastral, descripcion)
        VALUES ($1, $2, $3, $4)
        RETURNING fotoLecturaid AS "photoReadingId",
                  lecturaid AS "readingId",
                  imagenurl AS "photoUrl",
                  clavecatastral AS "cadastralKey",
                  descripcion AS "description",
                  createdAt AS "createdAt",
                  updatedAt AS "updatedAt";
      `;

      const params = [
        photoReading.getReadingId(),
        photoReading.getPhotoUrl(),
        photoReading.getCadastralKey(),
        photoReading.getDescription() || null,
      ];

      const result = await this.postgreSQLService.query<PhotoReadingSQLResponse>(query, params);

      if (result.length === 0) {
        return null;
      }

      const createdPhotoReading: PhotoReadingResponse = PhotoReadingAdapter.fromPhotoReadingSQLResponseToPhotoReadingResponse(result[0]);

      return createdPhotoReading;

    } catch (error) {
      throw error;
    }
  }

  async getPhotoReadingsByReadingId(readingId: number): Promise<PhotoReadingResponse[]> {
    try {
      const query = `
        SELECT 
          fotoLecturaid AS "photoReadingId",
          lecturaid AS "readingId",
          imagenurl AS "photoUrl",
          clavecatastral AS "cadastralKey",
          descripcion AS "description",
          createdAt AS "createdAt",
          updatedAt AS "updatedAt"
        FROM fotolectura
        WHERE lecturaid = $1;
      `;

      const params = [readingId];

      const result = await this.postgreSQLService.query<PhotoReadingSQLResponse>(query, params);

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `No photo readings found for reading ID ${readingId}`
        });
      }

      const photoReadings: PhotoReadingResponse[] = result.map(photoReadingSQL =>
        PhotoReadingAdapter.fromPhotoReadingSQLResponseToPhotoReadingResponse(photoReadingSQL)
      );

      return photoReadings;
    } catch (error) {
      throw error;
    }
  }

  async getPhotoReadingsByCadastralKey(cadastralKey: string): Promise<PhotoReadingResponse[]> {
    try {
      const query = `
        SELECT 
          fotoLecturaid AS "photoReadingId",
          lecturaid AS "readingId",
          imagenurl AS "photoUrl",
          clavecatastral AS "cadastralKey",
          descripcion AS "description",
          createdAt AS "createdAt",
          updatedAt AS "updatedAt"
        FROM fotolectura
        WHERE clavecatastral = $1;
      `;

      const params = [cadastralKey];

      const result = await this.postgreSQLService.query<PhotoReadingSQLResponse>(query, params);

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `No photo readings found for cadastral key ${cadastralKey}`
        });
      }

      const photoReadings: PhotoReadingResponse[] = result.map(photoReadingSQL =>
        PhotoReadingAdapter.fromPhotoReadingSQLResponseToPhotoReadingResponse(photoReadingSQL)
      );

      return photoReadings;
    } catch (error) {
      throw error;
    }
  }
}