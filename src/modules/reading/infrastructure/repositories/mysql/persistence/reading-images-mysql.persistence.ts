import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InterfaceReadingImagesRepository } from '../../../../domain/contracts/reading-images.interface.repository';
import { ReadingImagesModel } from '../../../../domain/schemas/model/reading-images.model';
import { ReadingImagesSQLResult } from '../../../interfaces/sql/reading-sql.result.interface';
import { ReadingSQLAdapter } from '../../../adapters/reading-sql.adapter';
import { statusCode } from '../../../../../../settings/environments/status-code';
import { DatabaseAbstract } from '../../../../../../shared/connections/database/abstract/abstract.database';

@Injectable()
export class ReadingImagesPersistenceMySQL
  implements InterfaceReadingImagesRepository
{
  constructor(private readonly databaseService: DatabaseAbstract) {}

  async getAllReadingsImages(): Promise<ReadingImagesModel[]> {
    const query: string = `
      SELECT
          fl.clave_catastral AS cadastral_key,
          fl.lectura_id AS reading_id,
          l.lectura_anterior as previews_reading,
          l.lectura_actual AS current_reading,
          JSON_ARRAYAGG(fl.imagen_url) AS images,
          l.mes_lectura AS reading_month,
          SUBSTRING(l.mes_lectura, 1, 4) AS reading_year,
          CASE SUBSTRING(l.mes_lectura, 6, 2)
              WHEN '01' THEN 'ENERO' WHEN '02' THEN 'FEBRERO' WHEN '03' THEN 'MARZO'
              WHEN '04' THEN 'ABRIL' WHEN '05' THEN 'MAYO' WHEN '06' THEN 'JUNIO'
              WHEN '07' THEN 'JULIO' WHEN '08' THEN 'AGOSTO' WHEN '09' THEN 'SEPTIEMBRE'
              WHEN '10' THEN 'OCTUBRE' WHEN '11' THEN 'NOVIEMBRE' WHEN '12' THEN 'DICIEMBRE'
              ELSE 'Mes inválido'
          END AS reading_month_name,
          l.novedad AS novelty,
          (l.lectura_actual - l.lectura_anterior) as consumption,
          l.observacion AS observation
      FROM foto_lectura fl
      INNER JOIN lectura l ON l.clave_catastral = fl.clave_catastral AND l.lectura_id = fl.lectura_id
      GROUP BY fl.clave_catastral, fl.lectura_id, l.mes_lectura, l.lectura_anterior, l.lectura_actual, l.novedad, l.observacion, consumption
      ORDER BY fl.clave_catastral;
    `;
    const result = await this.databaseService.query<ReadingImagesSQLResult>(query);
    if (result.length === 0) throw new RpcException({ statusCode: statusCode.NOT_FOUND, message: `No reading images found.` });
    return result.map(ReadingSQLAdapter.fromReadingPostgreSQLResultToReadingImagesModel);
  }

  async findReadingImagesByCadastralKey(cadastralKey: string): Promise<ReadingImagesModel[]> {
    const query: string = `
      SELECT
          fl.clave_catastral AS cadastral_key,
          fl.lectura_id AS reading_id,
          l.lectura_anterior AS previews_reading,
          l.lectura_actual AS current_reading,
          JSON_ARRAYAGG(fl.imagen_url) AS images,
          l.mes_lectura AS reading_month,
          SUBSTRING(l.mes_lectura, 1, 4) AS reading_year,
          CASE SUBSTRING(l.mes_lectura, 6, 2)
              WHEN '01' THEN 'ENERO' WHEN '02' THEN 'FEBRERO' WHEN '03' THEN 'MARZO'
              WHEN '04' THEN 'ABRIL' WHEN '05' THEN 'MAYO' WHEN '06' THEN 'JUNIO'
              WHEN '07' THEN 'JULIO' WHEN '08' THEN 'AGOSTO' WHEN '09' THEN 'SEPTIEMBRE'
              WHEN '10' THEN 'OCTUBRE' WHEN '11' THEN 'NOVIEMBRE' WHEN '12' THEN 'DICIEMBRE'
              ELSE 'Mes inválido'
          END AS reading_month_name,
          l.novedad AS novelty,
          (l.lectura_actual - l.lectura_anterior) AS consumption,
          l.observacion AS observation
      FROM foto_lectura fl
      INNER JOIN lectura l ON l.clave_catastral = fl.clave_catastral AND l.lectura_id = fl.lectura_id
      WHERE fl.clave_catastral = ?
      GROUP BY fl.clave_catastral, fl.lectura_id, l.mes_lectura, l.lectura_anterior, l.lectura_actual, l.novedad, l.observacion, consumption
      ORDER BY fl.clave_catastral DESC, l.mes_lectura DESC;
    `;
    const result = await this.databaseService.query<ReadingImagesSQLResult>(query, [cadastralKey]);
    if (result.length === 0) throw new RpcException({ statusCode: statusCode.NOT_FOUND, message: `No reading images found for: ${cadastralKey}` });
    return result.map(ReadingSQLAdapter.fromReadingPostgreSQLResultToReadingImagesModel);
  }

  async findReadingImagesByMonth(month: string): Promise<ReadingImagesModel[]> {
    const query: string = `
      SELECT
          fl.clave_catastral AS cadastral_key,
          fl.lectura_id AS reading_id,
          l.lectura_anterior AS previews_reading,
          l.lectura_actual AS current_reading,
          JSON_ARRAYAGG(fl.imagen_url) AS images,
          l.mes_lectura AS reading_month,
          SUBSTRING(l.mes_lectura, 1, 4) AS reading_year,
          CASE SUBSTRING(l.mes_lectura, 6, 2)
              WHEN '01' THEN 'ENERO' WHEN '02' THEN 'FEBRERO' WHEN '03' THEN 'MARZO'
              WHEN '04' THEN 'ABRIL' WHEN '05' THEN 'MAYO' WHEN '06' THEN 'JUNIO'
              WHEN '07' THEN 'JULIO' WHEN '08' THEN 'AGOSTO' WHEN '09' THEN 'SEPTIEMBRE'
              WHEN '10' THEN 'OCTUBRE' WHEN '11' THEN 'NOVIEMBRE' WHEN '12' THEN 'DICIEMBRE'
              ELSE 'Mes inválido'
          END AS reading_month_name,
          l.novedad AS novelty,
          (l.lectura_actual - l.lectura_anterior) AS consumption,
          l.observacion AS observation
      FROM foto_lectura fl
      INNER JOIN lectura l ON l.clave_catastral = fl.clave_catastral AND l.lectura_id = fl.lectura_id
      WHERE l.mes_lectura = ?
        AND l.fecha_lectura >= STR_TO_DATE(CONCAT(?, '-01'), '%Y-%m-%d')
        AND l.fecha_lectura < STR_TO_DATE(CONCAT(?, '-01'), '%Y-%m-%d') + INTERVAL 1 MONTH
      GROUP BY fl.clave_catastral, fl.lectura_id, l.mes_lectura, l.lectura_anterior, l.lectura_actual, l.novedad, l.observacion, consumption
      ORDER BY fl.clave_catastral;
    `;
    const result = await this.databaseService.query<ReadingImagesSQLResult>(query, [month, month, month]);
    return result.map(ReadingSQLAdapter.fromReadingPostgreSQLResultToReadingImagesModel);
  }

  async findReadingImagesByMonthAndSector(month: string, sector: number): Promise<ReadingImagesModel[]> {
    const query: string = `
      SELECT
          fl.clave_catastral AS cadastral_key,
          fl.lectura_id AS reading_id,
          l.lectura_anterior AS previews_reading,
          l.lectura_actual AS current_reading,
          JSON_ARRAYAGG(fl.imagen_url) AS images,
          l.mes_lectura AS reading_month,
          SUBSTRING(l.mes_lectura, 1, 4) AS reading_year,
          CASE SUBSTRING(l.mes_lectura, 6, 2)
              WHEN '01' THEN 'ENERO' WHEN '02' THEN 'FEBRERO' WHEN '03' THEN 'MARZO'
              WHEN '04' THEN 'ABRIL' WHEN '05' THEN 'MAYO' WHEN '06' THEN 'JUNIO'
              WHEN '07' THEN 'JULIO' WHEN '08' THEN 'AGOSTO' WHEN '09' THEN 'SEPTIEMBRE'
              WHEN '10' THEN 'OCTUBRE' WHEN '11' THEN 'NOVIEMBRE' WHEN '12' THEN 'DICIEMBRE'
              ELSE 'Mes inválido'
          END AS reading_month_name,
          l.novedad AS novelty,
          (l.lectura_actual - l.lectura_anterior) AS consumption,
          l.observacion AS observation
      FROM foto_lectura fl
      INNER JOIN lectura l ON l.clave_catastral = fl.clave_catastral AND l.lectura_id = fl.lectura_id
      WHERE l.mes_lectura = ? AND l.sector = ?
        AND l.fecha_lectura >= STR_TO_DATE(CONCAT(?, '-01'), '%Y-%m-%d')
        AND l.fecha_lectura < STR_TO_DATE(CONCAT(?, '-01'), '%Y-%m-%d') + INTERVAL 1 MONTH
      GROUP BY fl.clave_catastral, fl.lectura_id, l.mes_lectura, l.lectura_anterior, l.lectura_actual, l.novedad, l.observacion, consumption
      ORDER BY fl.clave_catastral;
    `;
    const result = await this.databaseService.query<ReadingImagesSQLResult>(query, [month, sector, month, month]);
    return result.map(ReadingSQLAdapter.fromReadingPostgreSQLResultToReadingImagesModel);
  }
}
