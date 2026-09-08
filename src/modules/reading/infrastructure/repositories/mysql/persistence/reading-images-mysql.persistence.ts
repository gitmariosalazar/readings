import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InterfaceReadingImagesRepository } from '../../../../domain/contracts/reading-images.interface.repository';
import { ReadingImagesModel } from '../../../../domain/schemas/model/reading-images.model';
import { ReadingImagesSQLResult } from '../../../interfaces/sql/reading-sql.result.interface';
import { ReadingSQLAdapter } from '../../../adapters/reading-sql.adapter';
import { statusCode } from '../../../../../../settings/environments/status-code';
import { DatabaseAbstract } from '../../../../../../shared/connections/database/abstract/abstract.database';

@Injectable()
export class ReadingImagesPersistenceMySQL implements InterfaceReadingImagesRepository {
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
    const result =
      await this.databaseService.query<ReadingImagesSQLResult>(query);
    if (result.length === 0)
      throw new RpcException({
        statusCode: statusCode.NOT_FOUND,
        message: `No reading images found.`,
      });
    return result.map(
      ReadingSQLAdapter.fromReadingPostgreSQLResultToReadingImagesModel,
    );
  }

  async findReadingImagesByCadastralKey(
    cadastralKey: string,
  ): Promise<ReadingImagesModel[]> {
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
    const result = await this.databaseService.query<ReadingImagesSQLResult>(
      query,
      [cadastralKey],
    );
    if (result.length === 0)
      throw new RpcException({
        statusCode: statusCode.NOT_FOUND,
        message: `No reading images found for: ${cadastralKey}`,
      });
    return result.map(
      ReadingSQLAdapter.fromReadingPostgreSQLResultToReadingImagesModel,
    );
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
    const result = await this.databaseService.query<ReadingImagesSQLResult>(
      query,
      [month, month, month],
    );
    return result.map(
      ReadingSQLAdapter.fromReadingPostgreSQLResultToReadingImagesModel,
    );
  }

  async findReadingImagesByMonthAndSector(
    month: string,
    sector: number,
  ): Promise<ReadingImagesModel[]> {
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
    const result = await this.databaseService.query<ReadingImagesSQLResult>(
      query,
      [month, sector, month, month],
    );
    return result.map(
      ReadingSQLAdapter.fromReadingPostgreSQLResultToReadingImagesModel,
    );
  }

  async findReadingImagesByFilter(filter: {
    month?: string;
    cadastralKey?: string;
    sector?: number;
    date?: Date;
  }): Promise<ReadingImagesModel[]> {
    const conditions: string[] = [];
    const params: (string | number | Date)[] = [];

    if (filter.month) {
      params.push(filter.month);
      const monthIndex = params.length;
      conditions.push(`l.mes_lectura = $${monthIndex}`);
      conditions.push(
        `l.fecha_lectura >= date_trunc('month', ($${monthIndex}::text || '-01')::date)`,
      );
      conditions.push(
        `l.fecha_lectura < date_trunc('month', ($${monthIndex}::text || '-01')::date) + interval '1 month'`,
      );
    }

    if (filter.cadastralKey) {
      params.push(filter.cadastralKey);
      conditions.push(`fl.clave_catastral = $${params.length}`);
    }

    if (filter.sector !== undefined) {
      params.push(filter.sector);
      conditions.push(`l.sector = $${params.length}`);
    }

    if (filter.date) {
      params.push(filter.date);
      conditions.push(`l.fecha_lectura::date = $${params.length}::date`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query: string = /*sql*/ `
        SELECT
            fl.clave_catastral           AS cadastral_key,
            fl.lectura_id                AS reading_id,
            l.lectura_anterior           AS previews_reading,
            l.lectura_actual             AS current_reading,
            ARRAY_AGG(fl.imagen_url)     AS images,
            l.mes_lectura                AS reading_month,
            substring(l.mes_lectura FROM 1 FOR 4)::integer   AS reading_year,
                CASE substring(l.mes_lectura FROM 6 FOR 2)::integer
                    WHEN 1  THEN 'ENERO'
                    WHEN 2  THEN 'FEBRERO'
                    WHEN 3  THEN 'MARZO'
                    WHEN 4  THEN 'ABRIL'
                    WHEN 5  THEN 'MAYO'
                    WHEN 6  THEN 'JUNIO'
                    WHEN 7  THEN 'JULIO'
                    WHEN 8  THEN 'AGOSTO'
                    WHEN 9  THEN 'SEPTIEMBRE'
                    WHEN 10 THEN 'OCTUBRE'
                    WHEN 11 THEN 'NOVIEMBRE'
                    WHEN 12 THEN 'DICIEMBRE'
                    ELSE 'Mes inválido'
            END AS reading_month_name,
            l.novedad AS novelty,
            (l.lectura_actual - l.lectura_anterior) AS consumption,
            l.observacion AS observation,
            a.estado_actualizacion AS updated_status
        FROM foto_lectura fl
        INNER JOIN lectura l
            ON l.clave_catastral = fl.clave_catastral
            AND l.lectura_id     = fl.lectura_id
        INNER JOIN acometida a
            ON a.acometida_id = l.acometida_id
        ${whereClause}
        GROUP BY
            fl.clave_catastral,
            fl.lectura_id,
            l.mes_lectura,
            reading_year,
            reading_month_name,
            l.lectura_anterior,
            l.lectura_actual,
            l.novedad,
            l.observacion,
            consumption,
            a.estado_actualizacion
        ORDER BY
            fl.clave_catastral;
    `;
    const result = await this.databaseService.query<ReadingImagesSQLResult>(
      query,
      params,
    );
    return result.map(
      ReadingSQLAdapter.fromReadingPostgreSQLResultToReadingImagesModel,
    );
  }
}
