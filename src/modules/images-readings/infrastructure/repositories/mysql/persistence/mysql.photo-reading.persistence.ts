import { Injectable } from '@nestjs/common';
import { PhotoReadingSQLResponse } from '../../../interfaces/sql/photo-reading.sql.response';
import { PhotoReadingAdapter } from '../../../adapters/photo-reading.adapter';
import { RpcException } from '@nestjs/microservices';
import { InterfacePhotoReadingRepository } from '../../../../domain/contracts/photo-reading.interface.repository';
import { PhotoReadingModel } from '../../../../domain/schemas/model/photo-reading.model';
import { statusCode } from '../../../../../../settings/environments/status-code';
import { DatabaseAbstract } from '../../../../../../shared/connections/database/abstract/abstract.database';

@Injectable()
export class PhotoReadingMySQLPersistence
  implements InterfacePhotoReadingRepository
{
  constructor(private readonly databaseService: DatabaseAbstract) {}

  async createPhotoReading(
    photoReading: PhotoReadingModel,
  ): Promise<PhotoReadingModel | null> {
    const query = `
      INSERT INTO foto_lectura (lectura_id, imagen_url, clave_catastral, descripcion)
      VALUES (?, ?, ?, ?);
    `;

    const params = [
      photoReading.getReadingId(),
      photoReading.getPhotoUrl(),
      photoReading.getCadastralKey(),
      photoReading.getDescription() || null,
    ];

    const { insertId } = await this.databaseService.execute(query, params);
    
    const selectResult = await this.databaseService.query<PhotoReadingSQLResponse>(`
      SELECT foto_lectura_id AS "photo_reading_id",
              lectura_id AS "reading_id",
              imagen_url AS "photo_url",
              clave_catastral AS "cadastral_key",
              descripcion AS "description",
              created_at AS "created_at",
              updated_at AS "updated_at"
      FROM foto_lectura WHERE foto_lectura_id = ?`, [insertId]);
    
    if (selectResult.length === 0) return null;

    return PhotoReadingAdapter.fromPhotoReadingSQLResponseToPhotoReadingModel(selectResult[0]);
  }

  async getPhotoReadingsByReadingId(
    readingId: number,
  ): Promise<PhotoReadingModel[]> {
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
      WHERE lectura_id = ?;
    `;

    const result = await this.databaseService.query<PhotoReadingSQLResponse>(query, [readingId]);

    if (result.length === 0) {
      throw new RpcException({
        statusCode: statusCode.NOT_FOUND,
        message: `No photo readings found for reading ID ${readingId}`,
      });
    }

    return result.map(PhotoReadingAdapter.fromPhotoReadingSQLResponseToPhotoReadingModel);
  }

  async getPhotoReadingsByCadastralKey(
    cadastralKey: string,
  ): Promise<PhotoReadingModel[]> {
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
      WHERE clave_catastral = ?;
    `;

    const result = await this.databaseService.query<PhotoReadingSQLResponse>(query, [cadastralKey]);

    if (result.length === 0) {
      throw new RpcException({
        statusCode: statusCode.NOT_FOUND,
        message: `No photo readings found for cadastral key ${cadastralKey}`,
      });
    }

    return result.map(PhotoReadingAdapter.fromPhotoReadingSQLResponseToPhotoReadingModel);
  }
}
