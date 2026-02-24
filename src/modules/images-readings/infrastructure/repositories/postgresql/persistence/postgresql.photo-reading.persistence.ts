import { Injectable } from '@nestjs/common';
import { PhotoReadingSQLResponse } from '../../../interfaces/sql/photo-reading.sql.response';
import { PhotoReadingAdapter } from '../adapters/photo-reading.adapter';
import { RpcException } from '@nestjs/microservices';
import { InterfacePhotoReadingRepository } from '../../../../domain/contracts/photo-reading.interface.repository';
import { DatabaseServicePostgreSQL } from '../../../../../../shared/connections/database/postgresql/postgresql.service';
import { PhotoReadingModel } from '../../../../domain/schemas/model/photo-reading.model';
import { statusCode } from '../../../../../../settings/environments/status-code';

@Injectable()
export class PhotoReadingPostgreSQLPersistence
  implements InterfacePhotoReadingRepository
{
  constructor(private readonly postgreSQLService: DatabaseServicePostgreSQL) {}

  async createPhotoReading(
    photoReading: PhotoReadingModel,
  ): Promise<PhotoReadingModel | null> {
    try {
      const query = `
        INSERT INTO foto_lectura (lectura_id, imagen_url, clave_catastral, descripcion)
        VALUES ($1, $2, $3, $4)
        RETURNING foto_lectura_id AS "photo_reading_id",
                  lectura_id AS "reading_id",
                  imagen_url AS "photo_url",
                  clave_catastral AS "cadastral_key",
                  descripcion AS "description",
                  created_at AS "created_at",
                  updated_at AS "updated_at";
      `;

      const params = [
        photoReading.getReadingId(),
        photoReading.getPhotoUrl(),
        photoReading.getCadastralKey(),
        photoReading.getDescription() || null,
      ];

      const result =
        await this.postgreSQLService.query<PhotoReadingSQLResponse>(
          query,
          params,
        );

      if (result.length === 0) {
        return null;
      }

      const createdPhotoReadingModel: PhotoReadingModel =
        PhotoReadingAdapter.fromPhotoReadingSQLResponseToPhotoReadingModel(
          result[0],
        );

      return createdPhotoReadingModel;
    } catch (error) {
      throw error;
    }
  }

  async getPhotoReadingsByReadingId(
    readingId: number,
  ): Promise<PhotoReadingModel[]> {
    try {
      const query = `
        SELECT 
          foto_lectura_id AS "photo_reading_id",
          lectura_id AS "reading_id",
          imagen_url AS "photo_url",
          clave_catastral AS "cadastral_key",
          descripcion AS "description",
          created_at AS "created_at",
          updated_at AS "updated_at"
        FROM foto_lectura
        WHERE lectura_id = $1;
      `;

      const params = [readingId];

      const result =
        await this.postgreSQLService.query<PhotoReadingSQLResponse>(
          query,
          params,
        );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `No photo readings found for reading ID ${readingId}`,
        });
      }

      const photoReadingModels: PhotoReadingModel[] = result.map(
        (photoReadingSQL) =>
          PhotoReadingAdapter.fromPhotoReadingSQLResponseToPhotoReadingModel(
            photoReadingSQL,
          ),
      );

      return photoReadingModels;
    } catch (error) {
      throw error;
    }
  }

  async getPhotoReadingsByCadastralKey(
    cadastralKey: string,
  ): Promise<PhotoReadingModel[]> {
    try {
      const query = `
        SELECT 
          foto_lectura_id AS "photo_reading_id",
          lectura_id AS "reading_id",
          imagen_url AS "photo_url",
          clave_catastral AS "cadastral_key",
          descripcion AS "description",
          created_at AS "created_at",
          updated_at AS "updated_at"
        FROM foto_lectura
        WHERE clave_catastral = $1;
      `;

      const params = [cadastralKey];

      const result =
        await this.postgreSQLService.query<PhotoReadingSQLResponse>(
          query,
          params,
        );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `No photo readings found for cadastral key ${cadastralKey}`,
        });
      }

      const photoReadingModels: PhotoReadingModel[] = result.map(
        (photoReadingSQL) =>
          PhotoReadingAdapter.fromPhotoReadingSQLResponseToPhotoReadingModel(
            photoReadingSQL,
          ),
      );

      return photoReadingModels;
    } catch (error) {
      throw error;
    }
  }
}
