import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InterfaceReadingImagesRepository } from '../../../../domain/contracts/reading-images.interface.repository';
import { ReadingImagesModel } from '../../../../domain/schemas/model/reading-images.model';
import { ReadingImagesSQLResult } from '../../../interfaces/sql/reading-sql.result.interface';
import { ReadingSQLAdapter } from '../../../adapters/reading-sql.adapter';
import { statusCode } from '../../../../../../settings/environments/status-code';
import { DatabaseAbstract } from '../../../../../../shared/connections/database/abstract/abstract.database';

@Injectable()
export class ReadingImagesPersistencePostgreSQL
  implements InterfaceReadingImagesRepository
{
  constructor(private readonly databaseService: DatabaseAbstract) {}

  async getAllReadingsImages(): Promise<ReadingImagesModel[]> {
    const query: string = `
        SELECT
            fl.clave_catastral           AS cadastral_key,
            fl.lectura_id                AS reading_id,
            l.lectura_anterior as previews_reading,
            l.lectura_actual AS current_reading,
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
            (l.lectura_actual - l.lectura_anterior) as consumption,
            l.observacion AS observation
        FROM foto_lectura fl
        INNER JOIN lectura l
            ON l.clave_catastral = fl.clave_catastral
            AND l.lectura_id     = fl.lectura_id
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
            consumption
        ORDER BY
            fl.clave_catastral;
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
            l.observacion AS observation
        FROM foto_lectura fl
        INNER JOIN lectura l
            ON l.clave_catastral = fl.clave_catastral
            AND l.lectura_id     = fl.lectura_id
        WHERE fl.clave_catastral = $1
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
            consumption
        ORDER BY
            fl.clave_catastral DESC, l.mes_lectura DESC;
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
            l.observacion AS observation
        FROM foto_lectura fl
        INNER JOIN lectura l
            ON l.clave_catastral = fl.clave_catastral
            AND l.lectura_id     = fl.lectura_id
        -- Double filter: mes_lectura + real fecha_lectura range (guards against mis-tagged legacy rows)
        WHERE l.mes_lectura = $1
          AND l.fecha_lectura >= date_trunc('month', ($1::text || '-01')::date)
          AND l.fecha_lectura  < date_trunc('month', ($1::text || '-01')::date) + interval '1 month'
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
            consumption
        ORDER BY
            fl.clave_catastral;
    `;
    const result = await this.databaseService.query<ReadingImagesSQLResult>(
      query,
      [month],
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
            l.observacion AS observation
        FROM foto_lectura fl
        INNER JOIN lectura l
            ON l.clave_catastral = fl.clave_catastral
            AND l.lectura_id     = fl.lectura_id
        -- Double filter: mes_lectura + real fecha_lectura range (guards against mis-tagged legacy rows)
        WHERE l.mes_lectura = $1
          AND l.sector = $2
          AND l.fecha_lectura >= date_trunc('month', ($1::text || '-01')::date)
          AND l.fecha_lectura  < date_trunc('month', ($1::text || '-01')::date) + interval '1 month'
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
            consumption
        ORDER BY
            fl.clave_catastral;
    `;
    const result = await this.databaseService.query<ReadingImagesSQLResult>(
      query,
      [month, sector],
    );
    return result.map(
      ReadingSQLAdapter.fromReadingPostgreSQLResultToReadingImagesModel,
    );
  }
}
