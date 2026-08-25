import { InterfaceReadingRepository } from '../../../../domain/contracts/reading.interface.repository';
import { Injectable } from '@nestjs/common';
import { toZonedTime } from 'date-fns-tz';
import {
  PendingReadingConnectionSQLResult,
  RangoTarifaSQLResult,
  ReadingBasicInfoSQLResult,
  ReadingHistorySQLResult,
  ReadingImagesSQLResult,
  ReadingInfoSQLResult,
  ReadingNoveltySQLResult,
  ReadingSQLResult,
  TakenReadingConnectionSQLResult,
  TarifaSQLResult,
} from '../../../interfaces/sql/reading-sql.result.interface';
import { ReadingSQLAdapter } from '../../../adapters/reading-sql.adapter';
import {
  DatabaseAbstract,
  IDatabaseClient,
} from '../../../../../../shared/connections/database/abstract/abstract.database';
import { ReadingBasicInfoModel } from '../../../../domain/schemas/model/reading-basic-info.model';
import { ReadingInfoModel } from '../../../../domain/schemas/model/reading-info.model';
import {
  ReadingModel,
  ReadingNoveltyModel,
} from '../../../../domain/schemas/model/reading.model';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from '../../../../../../settings/environments/status-code';
import { getTypeCurrentConsumption } from '../../../../../../shared/types/novelty.type';
import { ReadingHistoryModel } from '../../../../domain/schemas/model/reading-history.model';
import { ReadingImagesModel } from '../../../../domain/schemas/model/reading-images.model';
import { PendingReadingConnectionModel } from '../../../../domain/schemas/model/pending-reading-connection.model';
import { TakenReadingConnectionModel } from '../../../../domain/schemas/model/taken-reading-connection.model';
import { UUID } from 'crypto';
import { MapRouteFeatureCollection } from '../../../../domain/schemas/response/map-geojson';

@Injectable()
export class ReadingPersistenceMySQL implements InterfaceReadingRepository {
  constructor(private readonly databaseService: DatabaseAbstract) {}

  async findReadingBasicInfo(
    cadastralKey: string,
  ): Promise<ReadingBasicInfoModel[]> {
    const query: string = `
      SELECT
          l.lectura_id AS "reading_id",
          l.fecha_lectura AS "previous_reading_date",
          ac.acometida_id AS "cadastral_key",
          c.cliente_id AS "card_id",
          COALESCE(CONCAT(ci.nombres, ' ', ci.apellidos), e.razon_social) AS "client_name",
          ac.direccion AS address,
          l.lectura_anterior AS "previous_reading",
          l.lectura_actual AS "current_reading",
          ac.sector,
          ac.cuenta AS account,
          l.valor_lectura AS "reading_value",
          cp.average_consumption AS "average_consumption",
          ac.numero_medidor AS "meter_number",
          ac.tarifa_id AS "rate_id",
          ct.nombre AS "rate_name"
      FROM acometida ac
          LEFT JOIN cliente c ON ac.cliente_id = c.cliente_id
          LEFT JOIN ciudadano ci ON ci.ciudadano_id = c.cliente_id
          LEFT JOIN empresa e ON e.ruc = c.cliente_id
          INNER JOIN lectura l ON l.acometida_id = ac.acometida_id
          INNER JOIN tarifa t on t.tarifa_id = ac.tarifa_id
          left join categoria ct on t.categoria_id = ct.categoria_id
          LEFT JOIN consumo_promedio cp ON cp.acometida_id = ac.acometida_id
          WHERE ac.acometida_id = ? AND l.fecha_lectura IS NOT NULL
          ORDER BY l.fecha_lectura DESC LIMIT 2;
    `;
    const result = await this.databaseService.query<ReadingBasicInfoSQLResult>(
      query,
      [cadastralKey],
    );
    return result.map((r) =>
      ReadingSQLAdapter.fromReadingPostgreSQLResultToReadingBasicInfoModel(r),
    );
  }

  async findReadingInfo(cadastralKey: string): Promise<ReadingInfoModel[]> {
    const query: string = `
      WITH ultima_lectura_valida AS (
        SELECT l.*
        FROM lectura l
        WHERE l.acometida_id = ?
          AND l.fecha_lectura IS NOT NULL
          AND l.novedad IS NOT NULL
          AND l.novedad NOT LIKE '%INICIAL AUTOMÁTICA%'
          AND l.novedad NOT LIKE '%CAMBIO MEDIDOR%'
        ORDER BY l.fecha_lectura DESC
        LIMIT 5
      ),
      ranked AS (
        SELECT
          *,
          ROW_NUMBER() OVER (PARTITION BY acometida_id ORDER BY fecha_lectura DESC) AS rn,
          DATE_FORMAT(fecha_lectura, '%Y-%m-01') AS mes_lectura_trunc
        FROM ultima_lectura_valida
      ),
      mes_actual AS (
        SELECT DATE_FORMAT(CURRENT_DATE, '%Y-%m-01') AS mes_hoy
      ),
      lectura_mes_actual_existe AS (
        SELECT
          EXISTS (
            SELECT 1
            FROM lectura l
            WHERE l.acometida_id = ?
              AND DATE_FORMAT(l.fecha_lectura, '%Y-%m-01') = DATE_FORMAT(CURRENT_DATE, '%Y-%m-01')
              AND l.novedad NOT LIKE '%INICIAL AUTOMÁTICA%'
              AND l.novedad NOT LIKE '%CAMBIO MEDIDOR%'
          ) AS ya_tomada_mes_actual
      ),
      proximo_mes_esperado AS (
        SELECT
          COALESCE(
            DATE_FORMAT(MAX(l.fecha_lectura) + INTERVAL 1 MONTH, '%Y-%m-01'),
            DATE_FORMAT(CURRENT_DATE, '%Y-%m-01')
          ) AS mes_que_toca
        FROM lectura l
        WHERE l.acometida_id = ?
          AND l.fecha_lectura IS NOT NULL
          AND l.novedad NOT LIKE '%INICIAL AUTOMÁTICA%'
          AND l.novedad NOT LIKE '%CAMBIO MEDIDOR%'
      ),
      periodo AS (
        SELECT
          COALESCE(sl.fecha_inicio_periodo, CURRENT_DATE - INTERVAL 1 MONTH) AS inicio,
          sl.fecha_siguiente_lectura AS fecha_mitad,
          COALESCE(sl.fecha_fin_periodo, CURRENT_DATE + INTERVAL 1 MONTH) AS fin
        FROM siguiente_lectura sl
        WHERE sl.acometida_id = ?
      ),
      lectura_en_periodo AS (
        SELECT
          p.inicio,
          p.fin,
          (CURRENT_DATE BETWEEN p.inicio AND p.fin) AS en_periodo,
          EXISTS (
            SELECT 1
            FROM lectura l2
            WHERE l2.acometida_id = ?
              AND l2.fecha_lectura >= COALESCE(p.fecha_mitad, p.inicio)
              AND l2.novedad NOT LIKE '%INICIAL AUTOMÁTICA%'
              AND l2.novedad NOT LIKE '%CAMBIO MEDIDOR%'
          ) AS ya_tomada_en_periodo_actual
        FROM periodo p
      )
      SELECT
        l.lectura_id AS "reading_id",
        l.fecha_lectura AS "previous_reading_date",
        l.hora_lectura AS "reading_time",
        ac.acometida_id AS "cadastral_key",
        c.cliente_id AS "card_id",
        COALESCE(CONCAT(ci.nombres, ' ', ci.apellidos), e.razon_social) AS "client_name",
        cc.phones AS "client_phones",
        cc.correos AS "client_emails",
        ac.direccion AS address,
        l.lectura_anterior AS "previous_reading",
        l.lectura_actual AS "current_reading",
        l.valor_lectura AS "reading_value",
        ac.sector,
        ac.cuenta AS account,
        cp.average_consumption AS "average_consumption",
        ac.numero_medidor AS "meter_number",
        ac.tarifa_id AS "rate_id",
        ct.nombre AS "rate_name",
        CASE
          WHEN l.rn = 1
          AND pme.mes_que_toca = ma.mes_hoy
          AND NOT lmae.ya_tomada_mes_actual
          THEN true
          WHEN l.rn = 2 THEN true
          ELSE false
        END AS "has_current_reading",
        pme.mes_que_toca AS "next_month_to_take_debug",
        ma.mes_hoy AS "current_month_debug",
        lmae.ya_tomada_mes_actual AS "already_taken_current_month_debug",
        l.mes_lectura_trunc AS "reading_month_debug",
        lep.inicio AS "start_date_period",
        lep.fin AS "end_date_period",
        lep.en_periodo AS "in_period_debug",
        l.mes_lectura AS "month_reading",
        est.id_estado AS "connection_state_id",
        est.nombre AS "connection_state_name",
        est.descripcion AS "connection_state_description",
        est.permite_lectura AS "permit_reading"
      FROM ranked l
      CROSS JOIN proximo_mes_esperado pme
      CROSS JOIN mes_actual ma
      CROSS JOIN lectura_mes_actual_existe lmae
      CROSS JOIN periodo p
      CROSS JOIN lectura_en_periodo lep
      JOIN acometida ac ON ac.acometida_id = l.acometida_id
      JOIN cat_estados_acometida est ON ac.estado_id = est.id_estado
      LEFT JOIN cliente c ON c.cliente_id = ac.cliente_id
      LEFT JOIN ciudadano ci ON ci.ciudadano_id = c.cliente_id
      LEFT JOIN empresa e ON e.ruc = c.cliente_id
      INNER JOIN tarifa t ON t.tarifa_id = ac.tarifa_id
      LEFT JOIN categoria ct ON ct.categoria_id = t.categoria_id
      LEFT JOIN consumo_promedio cp ON cp.acometida_id = ac.acometida_id
      LEFT JOIN cliente_contacto cc ON cc.cliente_id = c.cliente_id
      WHERE l.rn <= 2
      ORDER BY l.fecha_lectura DESC;
    `;

    const result = await this.databaseService.query<ReadingInfoSQLResult>(
      query,
      [cadastralKey, cadastralKey, cadastralKey, cadastralKey, cadastralKey],
    );
    if (result.length === 0) {
      throw new RpcException({
        statusCode: statusCode.NOT_FOUND,
        message: `No readings found for cadastral key: ${cadastralKey}`,
      });
    }
    return result.map((r) =>
      ReadingSQLAdapter.fromReadingPostgreSQLResultToReadingInfoModel(r),
    );
  }

  async verifyReadingIfExist(readingId: number): Promise<boolean> {
    const query: string = `SELECT 1 FROM lectura WHERE lectura_id = ? LIMIT 1`;
    const result = await this.databaseService.query(query, [readingId]);
    return result.length > 0;
  }

  async updateCurrentReading(
    readingId: number,
    reading: ReadingModel,
    updateUserId: UUID,
  ): Promise<ReadingModel | null> {
    return this.databaseService.transaction(async (client: IDatabaseClient) => {
      const updateQuery: string = `
        UPDATE lectura
        SET valor_lectura = ?,
            tasa_alcantarillado = ?,
            lectura_actual = ?,
            novedad = ?,
            tipo_novedad_lectura_id = ?
        WHERE lectura_id = ?;
      `;
      const updateParams = [
        reading.readingValue ?? 0,
        reading.sewerRate ?? 0,
        reading.currentReading ?? 0,
        reading.novelty ?? 'NO NOVELTY',
        reading.typeNoveltyReadingId ?? 1,
        readingId,
      ];

      const { affectedRows } = await client.execute(updateQuery, updateParams);
      if (affectedRows === 0) return null;

      await client.query(
        `INSERT INTO usuario_lectura(usuario_id, lectura_id, action_type_id) VALUES (?, ?, 2)`,
        [updateUserId, readingId],
      );

      const selectQuery = `
      SELECT
        lectura_id as "reading_id",
        acometida_id as "connection_id",
        fecha_lectura as "reading_date",
        hora_lectura as "reading_time",
        sector as "sector",
        cuenta as "account",
        clave_catastral as "cadastral_key",
        valor_lectura as "reading_value",
        tasa_alcantarillado as "sewer_rate",
        lectura_anterior as "previous_reading",
        lectura_actual as "current_reading",
        codigo_ingreso_renta as "rental_income_code",
        novedad as "novelty",
        codigo_ingreso as "income_code",
        codigo_lectura as "reading_code"
        FROM lectura WHERE lectura_id = ?`;
      const rows = await client.query<ReadingSQLResult>(selectQuery, [
        readingId,
      ]);

      return ReadingSQLAdapter.fromReadingSQLResultToReadingModel(rows[0]);
    });
  }

  async createReading(
    reading: ReadingModel,
    creatorUserId: UUID,
  ): Promise<ReadingModel | null> {
    return this.databaseService.transaction(async (client: IDatabaseClient) => {
      const acometidaId = reading.connectionId;

      const pendQuery = `SELECT lectura_estado_id FROM lectura_estado WHERE codigo = 'PEND' LIMIT 1;`;
      const fuerQuery = `SELECT lectura_estado_id FROM lectura_estado WHERE codigo = 'FUER' LIMIT 1;`;
      const estadoAcometidaQuery = `
          SELECT est.permite_lectura, est.nombre AS estado_nombre
          FROM acometida ac
          JOIN cat_estados_acometida est ON ac.estado_id = est.id_estado
          WHERE ac.acometida_id = ?
          LIMIT 1;
      `;

      const [pendRows, fuerRows, estadoAcometidaRows] = await Promise.all([
        client.query<any>(pendQuery),
        client.query<any>(fuerQuery),
        client.query<any>(estadoAcometidaQuery, [acometidaId]),
      ]);

      if (estadoAcometidaRows.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `La acometida ${acometidaId} no existe o no tiene estado registrado.`,
        });
      }
      if (!estadoAcometidaRows[0].permite_lectura) {
        throw new RpcException({
          statusCode: statusCode.FORBIDDEN,
          message: `La acometida ${acometidaId} tiene estado "${estadoAcometidaRows[0].estado_nombre}" y no permite el ingreso de lecturas.`,
        });
      }

      const pendId = pendRows.length > 0 ? pendRows[0].lectura_estado_id : null;
      const fuerId = fuerRows.length > 0 ? fuerRows[0].lectura_estado_id : null;
      if (!pendId || !fuerId) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: `Estados PEND o FUER no encontrados.`,
        });
      }

      const timeZone = 'America/Guayaquil';
      const now = new Date();
      const zonedDate = toZonedTime(now, timeZone);
      const fechaLecturaInput = reading.readingDate ?? zonedDate;
      const mesLectura = zonedDate.toISOString().split('T')[0].slice(0, 7);
      const novedadInput = reading.novelty ?? 'LECTURA NORMAL';
      const observation = novedadInput.includes('LECTURA NORMAL')
        ? 'NORMAL'
        : novedadInput;
      const isEspecial =
        novedadInput.includes('INICIAL') ||
        novedadInput.includes('CAMBIO DE MEDIDOR');

      const countQuery = `
        SELECT 
          SUM(CASE WHEN novedad NOT LIKE '%INICIAL%' AND novedad NOT LIKE '%CAMBIO DE MEDIDOR%' THEN 1 ELSE 0 END) AS normales,
          SUM(CASE WHEN novedad LIKE '%INICIAL%' OR novedad LIKE '%CAMBIO DE MEDIDOR%' THEN 1 ELSE 0 END) AS especiales
        FROM lectura
        WHERE acometida_id = ?
          AND DATE_FORMAT(fecha_lectura, '%Y-%m') = ?
          AND lectura_estado_id IS NOT NULL;
      `;
      const countRows = await client.query<any>(countQuery, [
        acometidaId,
        mesLectura,
      ]);
      const normales = parseInt(countRows[0].normales || '0', 10);
      const especiales = parseInt(countRows[0].especiales || '0', 10);

      if (!isEspecial && normales >= 1) {
        throw new RpcException({
          statusCode: statusCode.CONFLICT,
          message: `Ya existe una lectura normal en ${mesLectura}.`,
        });
      }
      if (isEspecial && especiales >= 2) {
        throw new RpcException({
          statusCode: statusCode.CONFLICT,
          message: `Máximo 2 lecturas especiales en ${mesLectura}.`,
        });
      }

      const avgQuery = `SELECT average_consumption FROM consumo_promedio WHERE acometida_id = ? LIMIT 1;`;
      const avgRows = await client.query<any>(avgQuery, [acometidaId]);
      const averageConsumption =
        avgRows.length > 0 ? parseFloat(avgRows[0].average_consumption) : 0;

      // <-- NUEVO: Obtener novedades dinámicas configuradas en la BD dentro de la transacción
      const noveltiesRows = await client.query<any>(`
            SELECT 
                tipo_novedad_lectura_id AS id,
                nombre AS title,
                descripcion AS description,
                min_porcentaje AS "minPercentage",
                max_porcentaje AS "maxPercentage",
                accion_recomendada AS "actionRecommended"
            FROM 
                tipo_novedad_lectura
            ORDER BY 
                tipo_novedad_lectura_id ASC;
          `);
      const calculatedNovelty = getTypeCurrentConsumption(
        reading.previousReading,
        reading.currentReading,
        averageConsumption,
        noveltiesRows, // <-- Pasar las novedades obtenidas de la BD
      );

      const nextQuery = `SELECT fecha_inicio_periodo, fecha_fin_periodo FROM siguiente_lectura WHERE acometida_id = ?;`;
      const nextRows = await client.query<any>(nextQuery, [acometidaId]);

      let estadoId = pendId;
      let novedadFinal = calculatedNovelty.title;
      let observationFinal = observation;

      const hoy = new Date(fechaLecturaInput);
      hoy.setHours(0, 0, 0, 0);

      if (nextRows.length > 0) {
        const inicioDate = new Date(nextRows[0].fecha_inicio_periodo);
        const finDate = new Date(nextRows[0].fecha_fin_periodo);
        if (hoy < inicioDate || hoy > finDate) {
          estadoId = fuerId;
          observationFinal = observation || 'LECTURA FUERA DE PERIODO';
        }
      } else {
        estadoId = fuerId;
        observationFinal = observation || 'LECTURA SIN PERIODO DEFINIDO';
      }

      // Autogenerar sec_id y codigo_lectura (ya que MySQL no soporta 2 AUTO_INCREMENT ni triggers sobre la misma tabla insertada)
      const maxSecResult = await client.query<any>(
        'SELECT COALESCE(MAX(sec_id), 0) as max_sec FROM lectura;',
      );
      const nextSecId = Number(maxSecResult[0].max_sec) + 1;
      const codigoLectura = `L-EPAA-${String(nextSecId).padStart(12, '0')}`;

      const insertQuery = `
        INSERT INTO lectura(
          sec_id, codigo_lectura, acometida_id, fecha_lectura, hora_lectura, sector, cuenta, clave_catastral,
          valor_lectura, tasa_alcantarillado, lectura_anterior, lectura_actual,
          codigo_ingreso_renta, novedad, codigo_ingreso, tipo_novedad_lectura_id, lectura_estado_id, mes_lectura, observacion,ubicacion_captura
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;

      const horaLectura =
        reading.readingTime ||
        new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'America/Guayaquil',
          hour12: false,
        }).format(new Date());

      const params = [
        nextSecId,
        codigoLectura,
        acometidaId,
        fechaLecturaInput,
        horaLectura,
        reading.sector,
        reading.account,
        reading.cadastralKey,
        reading.readingValue ?? 0,
        reading.sewerRate ?? 0,
        reading.previousReading ?? 0,
        reading.currentReading ?? 0,
        reading.rentalIncomeCode ?? null,
        novedadFinal,
        reading.incomeCode ?? null,
        reading.typeNoveltyReadingId ?? 1,
        estadoId,
        mesLectura,
        observationFinal,
        reading.locationCapture ?? null,
      ];

      const { insertId } = await client.execute(insertQuery, params);

      const selectQuery = `
      SELECT 
        lectura_id as "reading_id",
        acometida_id as "connection_id",
        fecha_lectura as "reading_date",
        hora_lectura as "reading_time",
        sector as "sector",
        cuenta as "account",
        clave_catastral as "cadastral_key",
        valor_lectura as "reading_value",
        tasa_alcantarillado as "sewer_rate",
        lectura_anterior as "previous_reading",
        lectura_actual as "current_reading",
        codigo_ingreso_renta as "rental_income_code",
        novedad as "novelty",
        codigo_ingreso as "income_code",
        codigo_lectura as "reading_code"
      FROM lectura WHERE lectura_id = ?`;
      const selectRows = await client.query<any>(selectQuery, [insertId]);

      await client.query(
        `INSERT INTO usuario_lectura(usuario_id, lectura_id, action_type_id) VALUES (?, ?, 1)`,
        [creatorUserId, insertId],
      );

      return ReadingSQLAdapter.fromReadingSQLResultToReadingModel(
        selectRows[0],
      );
    });
  }

  async save(
    reading: ReadingModel,
    creatorUserId: UUID,
  ): Promise<ReadingModel> {
    const result = await this.createReading(reading, creatorUserId);
    if (!result) throw new Error('Failed to save reading');
    return result;
  }

  async findReadingHistoryByCadastralKey(
    cadastralKey: string,
    limit: number,
    offset: number,
  ): Promise<ReadingHistoryModel[]> {
    const query: string = `
      SELECT
          l.lectura_id AS reading_id,
          l.acometida_id AS connection_id,
          SUBSTRING(l.mes_lectura, 1, 4) AS reading_year,
          CASE SUBSTRING(l.mes_lectura, 6, 2)
              WHEN '01' THEN 'ENERO' WHEN '02' THEN 'FEBRERO' WHEN '03' THEN 'MARZO'
              WHEN '04' THEN 'ABRIL' WHEN '05' THEN 'MAYO' WHEN '06' THEN 'JUNIO'
              WHEN '07' THEN 'JULIO' WHEN '08' THEN 'AGOSTO' WHEN '09' THEN 'SEPTIEMBRE'
              WHEN '10' THEN 'OCTUBRE' WHEN '11' THEN 'NOVIEMBRE' WHEN '12' THEN 'DICIEMBRE'
              ELSE 'Mes inválido'
          END AS reading_month,
          l.fecha_lectura AS reading_date,
          l.hora_lectura AS reading_time,
          l.lectura_anterior AS previous_reading,
          l.lectura_actual AS current_reading,
          (l.lectura_actual - l.lectura_anterior) AS consumption,
          l.novedad AS observation
      FROM lectura l
      WHERE l.acometida_id = ?
        AND l.fecha_lectura IS NOT NULL
      ORDER BY l.fecha_lectura DESC
      LIMIT ? OFFSET ?;
    `;
    const result = await this.databaseService.query<ReadingHistorySQLResult>(
      query,
      [cadastralKey, limit, offset],
    );
    return result.map((r) =>
      ReadingSQLAdapter.fromReadingPostgreSQLResultToReadingHistoryModel(r),
    );
  }

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
      GROUP BY fl.clave_catastral, fl.lectura_id, l.mes_lectura, l.lectura_anterior, l.lectura_actual, l.novedad, l.observacion
      ORDER BY fl.clave_catastral;
    `;
    const result =
      await this.databaseService.query<ReadingImagesSQLResult>(query);
    return result.map((r) =>
      ReadingSQLAdapter.fromReadingPostgreSQLResultToReadingImagesModel(r),
    );
  }

  async findReadingsImagesByCadastralKey(
    cadastralKey: string,
  ): Promise<ReadingImagesModel[]> {
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
      WHERE fl.clave_catastral = ?
      GROUP BY fl.clave_catastral, fl.lectura_id, l.mes_lectura, l.lectura_anterior, l.lectura_actual, l.novedad, l.observacion
      ORDER BY fl.clave_catastral;
    `;
    const result = await this.databaseService.query<ReadingImagesSQLResult>(
      query,
      [cadastralKey],
    );
    return result.map((r) =>
      ReadingSQLAdapter.fromReadingPostgreSQLResultToReadingImagesModel(r),
    );
  }

  async getPendingReadingsByMonth(
    dateMonth: string,
    sector?: number | number[] | null,
  ): Promise<PendingReadingConnectionModel[]> {
    const dateMonthFormatted = dateMonth.replace('/', '-');
    const params: any[] = [dateMonthFormatted];
    let sectorClause = '';
    if (sector != null) {
      const sectors = Array.isArray(sector) ? sector : [sector];
      sectorClause = `AND ac.sector IN (${sectors.map(() => '?').join(',')})`;
      params.push(...sectors);
    }

    const query = `
      SELECT ac.acometida_id AS cadastral_key,
      ac.numero_medidor AS meter_number,
      ac.direccion AS address,
      ac.sector,
      ac.cuenta AS account,
      ac.tarifa_id AS rate_id,
      ac.estado,
      ct.nombre AS rate_name,
      COALESCE(CONCAT(ci.nombres, ' ', ci.apellidos), e.razon_social, 'Sin nombre') AS client_name,
      c.cliente_id AS card_id,
      cp.average_consumption AS average_consumption,
      JSON_ARRAY() as customers_emails, JSON_ARRAY() as customers_phones
      FROM acometida ac
      LEFT JOIN cliente c ON ac.cliente_id = c.cliente_id
      LEFT JOIN ciudadano ci ON ci.ciudadano_id = c.cliente_id
      LEFT JOIN empresa e ON e.ruc = c.cliente_id
      LEFT JOIN tarifa t ON t.tarifa_id = ac.tarifa_id
      LEFT JOIN categoria ct ON t.categoria_id = ct.categoria_id
      LEFT JOIN consumo_promedio cp ON cp.acometida_id = ac.acometida_id
      WHERE NOT EXISTS (SELECT 1 FROM lectura l WHERE l.acometida_id = ac.acometida_id AND DATE_FORMAT(l.fecha_lectura, '%Y-%m') = ?) ${sectorClause} AND ac.estado_id = 1;
    `;
    const result =
      await this.databaseService.query<PendingReadingConnectionSQLResult>(
        query,
        params,
      );
    return result.map((r) =>
      ReadingSQLAdapter.fromPendingReadingConnectionPostgreSQLResultToPendingReadingConnectionModel(
        r,
      ),
    );
  }

  async getTakenReadingsByMonth(
    dateMonth: string,
    sector?: number | number[] | null,
    userId?: string | null,
  ): Promise<TakenReadingConnectionModel[]> {
    const dateMonthFormatted = dateMonth.replace('/', '-');
    const params: any[] = [dateMonthFormatted];
    let sectorClause = '';
    if (sector != null) {
      const sectors = Array.isArray(sector) ? sector : [sector];
      sectorClause = `AND ac.sector IN (${sectors.map(() => '?').join(',')})`;
      params.push(...sectors);
    }

    let userIdClause = '';
    if (userId) {
      userIdClause = `AND u_creador.cedula = ?`;
      params.push(userId);
    }

    const query = /*sql*/ `
      SELECT
        l.lectura_id AS reading_id,
        l.fecha_lectura AS reading_date,
        ac.acometida_id AS cadastral_key,
        ac.numero_medidor AS meter_number,
        ac.direccion AS address,
        ac.sector,
        ac.cuenta AS account,
        COALESCE(CONCAT(ci.nombres, ' ', ci.apellidos), e.razon_social, 'Sin nombre') AS client_name,
        c.cliente_id AS card_id,
        l.lectura_anterior AS previous_reading,
        l.lectura_actual AS current_reading,
        l.valor_lectura AS reading_value,
        (l.lectura_actual - l.lectura_anterior) AS calculated_consumption,
        cp.average_consumption AS average_consumption,
        ct.nombre AS rate_name,
        l.tipo_novedad_lectura_id AS reading_type_id,
        l.novedad AS reading_type_name,
        l.novedad AS novelty,
        l.codigo_lectura AS reading_code,
        -- Información del usuario creador/recolector
        u_creador.cedula AS creator_card_id,
        u_creador.nombres AS creator_first_name,
        u_creador.apellidos AS creator_last_name,

        -- Información del usuario actualizador (si aplica)
        u_actualizador.cedula AS updater_card_id,
        u_actualizador.nombres AS updater_first_name,
        u_actualizador.apellidos AS updater_last_name
        FROM acometida ac
        INNER JOIN lectura l ON l.acometida_id = ac.acometida_id
        LEFT JOIN cliente c ON ac.cliente_id = c.cliente_id
        LEFT JOIN ciudadano ci ON ci.ciudadano_id = c.cliente_id
        LEFT JOIN empresa e ON e.ruc = c.cliente_id
        LEFT JOIN tarifa t ON t.tarifa_id = ac.tarifa_id
        LEFT JOIN categoria ct ON t.categoria_id = ct.categoria_id
        LEFT JOIN consumo_promedio cp ON cp.acometida_id = ac.acometida_id

        -- Join específico para obtener el USUARIO CREADOR
        LEFT JOIN usuario_lectura ulc ON l.lectura_id = ulc.lectura_id
                                    AND ulc.action_type_id = 1 -- Sustituir por el ID/Código de la acción "CREAR/REGISTRAR"
        LEFT JOIN cat_action_types act_c ON act_c.id = ulc.action_type_id
        LEFT JOIN empleados u_creador ON u_creador.usuario_id = ulc.usuario_id

        -- Join específico para obtener el USUARIO ACTUALIZADOR / MODIFICADOR
        LEFT JOIN usuario_lectura ulu ON l.lectura_id = ulu.lectura_id
                                    AND ulu.action_type_id = 2 -- Sustituir por el ID/Código de la acción "ACTUALIZAR/EDITAR"
        LEFT JOIN cat_action_types act_u ON act_u.id = ulu.action_type_id
        LEFT JOIN empleados u_actualizador ON u_actualizador.usuario_id = ulu.usuario_id
      WHERE DATE_FORMAT(l.fecha_lectura, '%Y-%m') = ? 
        -- AND l.novedad NOT IN ('NORMAL', 'LECTURA NORMAL')
        ${sectorClause}
        ${userIdClause};
    `;
    const result =
      await this.databaseService.query<TakenReadingConnectionSQLResult>(
        query,
        params,
      );
    return result.map((r) =>
      ReadingSQLAdapter.fromTakenReadingConnectionPostgreSQLResultToTakenReadingConnectionModel(
        r,
      ),
    );
  }

  async getTakenReadingEstimatesOrAverage(
    dateMonth: string,
    sector?: number | number[] | null,
    userId?: string | null,
  ): Promise<TakenReadingConnectionModel[]> {
    return this.getTakenReadingsByMonth(dateMonth, sector, userId);
  }

  async getReadingByNovelty(
    dateMonth: string,
    novelty?: string,
    sector?: number,
    userId?: string | null,
  ): Promise<ReadingNoveltyModel[]> {
    const dateMonthFormatted = dateMonth.replace('/', '-');

    // 1. Iniciamos SOLO con el mes, que es el primer '?' obligatorio en tu WHERE
    const params: any[] = [dateMonthFormatted];

    // 2. Procesamos la Novedad PRIMERO, porque en tu WHERE va antes que el sector
    let noveltyCondition = '';
    // Usamos if (novelty) para descartar automáticamente null, undefined y strings vacíos ('')
    if (novelty) {
      noveltyCondition = `AND l.novedad = ?`;
      params.push(novelty);
    } else {
      noveltyCondition = `AND l.novedad IS NOT NULL`;
    }

    // 3. Procesamos el Sector DESPUÉS, porque en tu WHERE va al final
    let sectorClause = '';
    if (sector != null) {
      if (isNaN(Number(sector))) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST, // Ajusta tu statusCode
          message: `El sector debe ser un número válido.`,
        });
      }
      sectorClause = `AND ac.sector = ?`;
      params.push(Number(sector));
    }

    let userIdClause = '';
    if (userId) {
      userIdClause = `AND u_creador.cedula = ?`;
      params.push(userId);
    }

    const query = /*sql*/ `
      SELECT
        l.lectura_id AS                       reading_id,
        l.fecha_lectura AS                    reading_date,
        l.mes_lectura AS                      reading_month,
        l.hora_lectura AS                     reading_time,
        ac.acometida_id AS                    cadastral_key,
        ac.numero_medidor AS                  meter_number,
        ac.direccion AS                       address,
        ac.sector,
        ac.cuenta AS                          account,
        COALESCE(CONCAT(ci.nombres, ' ', ci.apellidos), e.razon_social, 'Sin nombre') AS client_name,
        c.cliente_id AS                       card_id,
        l.lectura_anterior AS                 previous_reading,
        l.lectura_actual AS                   current_reading,
        l.valor_lectura AS                    reading_value,
        (l.lectura_actual - l.lectura_anterior) AS calculated_consumption,
        cp.average_consumption AS             average_consumption,
        ct.nombre AS                          rate_name,
        l.tipo_novedad_lectura_id AS          reading_type_id,
        l.novedad AS                          reading_type_name,
        l.novedad AS                          novelty,
        tnl.tipo_novedad_lectura_id AS        novelty_type_id,
        tnl.nombre AS                         novelty_type_name,
        tnl.descripcion AS                    novelty_type_description,
        JSON_ARRAYAGG(fl.imagen_url) AS       images,
        l.codigo_lectura AS                   reading_code,
        -- Información del usuario creador/recolector
        u_creador.cedula AS creator_card_id,
        u_creador.nombres AS creator_first_name,
        u_creador.apellidos AS creator_last_name,

        -- Información del usuario actualizador (si aplica)
        u_actualizador.cedula AS updater_card_id,
        u_actualizador.nombres AS updater_first_name,
        u_actualizador.apellidos AS updater_last_name
      FROM acometida ac
      INNER JOIN lectura l ON l.acometida_id = ac.acometida_id
      LEFT JOIN cliente c ON ac.cliente_id = c.cliente_id
      LEFT JOIN ciudadano ci ON ci.ciudadano_id = c.cliente_id
      LEFT JOIN empresa e ON e.ruc = c.cliente_id
      LEFT JOIN tarifa t ON t.tarifa_id = ac.tarifa_id
      LEFT JOIN categoria ct ON t.categoria_id = ct.categoria_id
      LEFT JOIN consumo_promedio cp ON cp.acometida_id = ac.acometida_id
      LEFT JOIN tipo_novedad_lectura tnl ON tnl.tipo_novedad_lectura_id = l.tipo_novedad_lectura_id
      LEFT JOIN foto_lectura fl ON fl.lectura_id = l.lectura_id AND fl.clave_catastral = ac.acometida_id
        -- Join específico para obtener el USUARIO CREADOR
        LEFT JOIN usuario_lectura ulc ON l.lectura_id = ulc.lectura_id
                                    AND ulc.action_type_id = 1 -- Sustituir por el ID/Código de la acción "CREAR/REGISTRAR"
        LEFT JOIN cat_action_types act_c ON act_c.id = ulc.action_type_id
        LEFT JOIN empleados u_creador ON u_creador.usuario_id = ulc.usuario_id

        -- Join específico para obtener el USUARIO ACTUALIZADOR / MODIFICADOR
        LEFT JOIN usuario_lectura ulu ON l.lectura_id = ulu.lectura_id
                                    AND ulu.action_type_id = 2 -- Sustituir por el ID/Código de la acción "ACTUALIZAR/EDITAR"
        LEFT JOIN cat_action_types act_u ON act_u.id = ulu.action_type_id
        LEFT JOIN empleados u_actualizador ON u_actualizador.usuario_id = ulu.usuario_id
      WHERE l.mes_lectura = ? 
        ${noveltyCondition} 
        ${sectorClause}
        ${userIdClause}
      GROUP BY l.lectura_id, ac.acometida_id, ac.numero_medidor, ac.direccion, ac.sector, ac.cuenta, c.cliente_id, ci.nombres, ci.apellidos, e.razon_social, l.lectura_anterior, l.lectura_actual, l.valor_lectura, cp.average_consumption, ct.nombre, l.tipo_novedad_lectura_id, l.novedad, tnl.tipo_novedad_lectura_id, tnl.nombre, tnl.descripcion, u_creador.cedula, u_creador.nombres, u_creador.apellidos, u_actualizador.cedula, u_actualizador.nombres, u_actualizador.apellidos, l.codigo_lectura
      ORDER BY l.fecha_lectura DESC;
    `;

    const result = await this.databaseService.query<ReadingNoveltySQLResult>(
      query,
      params,
    );

    return result.map((r) =>
      ReadingSQLAdapter.fromReadingNoveltySQLResultToReadingNoveltyModel(r),
    );
  }

  async calculateReadingValue(
    cadastralKey: string,
    consumptionM3: number,
  ): Promise<number> {
    try {
      if (consumptionM3 < 0) {
        return 0;
      }
      // 1. Obtener la tarifa de la acometida
      const queryAcometida = /*sql*/ `
          SELECT cat.categoria_id FROM acometida a
            INNER JOIN tarifa t
            ON a.tarifa_id = t.tarifa_id
            INNER JOIN categoria cat ON cat.categoria_id = t.categoria_id
            WHERE acometida_id = $1;
      `;

      const queryParams: any[] = [cadastralKey];

      const resultAcometida = await this.databaseService.query<TarifaSQLResult>(
        queryAcometida,
        queryParams,
      );

      if (resultAcometida.length === 0) {
        console.warn(
          `No se encontró acometida para la clave catastral: ${cadastralKey}`,
        );
        return 0;
      }

      const tarifa: number = Number(resultAcometida[0].categoria_id);

      // 2. Obtener los rangos de tarifas
      const queryTarifas = /*sql*/ `
          SELECT
              minimo AS "Minimo",
              maximo AS "Maximo",
              base AS "Base",
              adicional AS "Adicional"
          FROM valor_tarifa
          WHERE id_categoria = $1
          ORDER BY minimo ASC;
      `;

      const queryParamsTarifas: any[] = [tarifa];

      const resultTarifas =
        await this.databaseService.query<RangoTarifaSQLResult>(
          queryTarifas,
          queryParamsTarifas,
        );

      if (resultTarifas.length === 0) {
        console.warn(`No se encontraron rangos para la tarifa: ${tarifa}`);
        return 0;
      }

      let min = 0;
      let max = 0;
      let bas = 0;
      let adic = 0;
      let bMinimo = 0;
      let bMaximo = 0;

      // Tomamos el primer y último para mensajes de error
      bMinimo = resultTarifas[0].Minimo;
      bMaximo = resultTarifas[resultTarifas.length - 1].Maximo;

      // Buscar el rango correspondiente
      for (const row of resultTarifas) {
        const minimo = Number(row.Minimo);
        const maximo = Number(row.Maximo);

        if (consumptionM3 >= minimo && consumptionM3 <= maximo) {
          min = minimo;
          max = maximo;
          bas = Number(row.Base);
          adic = Number(row.Adicional);
          break; // encontrado → salimos
        }
      }

      // Si no encontró ningún rango válido
      if (bas === 0) {
        console.warn(
          `Consumo ${consumptionM3} m³ fuera de rango para la clave catastral '${cadastralKey}' - Tarifa '${tarifa}'. ` +
            `Rango permitido: ${bMinimo} a ${bMaximo} m³. Consulte el pliego tarifario.`,
        );
        // Aquí podrías lanzar un error o mostrar un mensaje en UI
        // alert(...) si estás en frontend, pero como es función, retornamos 0
        return 0;
      }

      // Cálculo final
      let valorPagar: number;

      if (consumptionM3 >= 0 && consumptionM3 <= 10) {
        valorPagar = bas;
      } else {
        // valor base + adicional por m³ extras (a partir de min - 1)
        const m3Adicionales = consumptionM3 - (min - 1);
        valorPagar = bas + m3Adicionales * adic;
      }

      return valorPagar;
    } catch (error) {
      console.error('Error al calcular ValorPagarConsumo:', error);
      throw error; // o retornar 0 según tu política
    }
  }

  async getMapGeojsonByDayAndByUser(
    date: string,
    userId?: string,
  ): Promise<MapRouteFeatureCollection> {
    try {
      const params: any[] = [date];
      let userIdClause = '';
      if (userId) {
        userIdClause = `AND u.usuario_id = $2`;
        params.push(userId);
      }

      const query = /*sql*/ `
          WITH lecturas_ordenadas AS (
              SELECT
                  l.lectura_id,
                  l.acometida_id,
                  l.clave_catastral,
                  l.hora_lectura,
                  l.fecha_lectura,
                  l.novedad,
                  l.ubicacion_captura,
                  a.coordenadas,
                  u.usuario_id,
                  emp.cedula,
                  -- Numeramos las lecturas cronológicamente (1, 2, 3...)
                  ROW_NUMBER() OVER(ORDER BY l.fecha_lectura ASC) AS orden,
                  -- Contamos el total para poder detectar cuál es la última
                  COUNT(*) OVER() AS total_lecturas
              FROM lectura l
              JOIN acometida a ON l.acometida_id = a.acometida_id
              LEFT JOIN usuario_lectura u on u.lectura_id = l.lectura_id
              LEFT JOIN empleados emp on emp.usuario_id = u.usuario_id
              WHERE l.ubicacion_captura IS NOT NULL
                AND a.coordenadas IS NOT NULL
                AND DATE(l.fecha_lectura) = $1
                ${userIdClause}
                -- AND l.sector = 1
                -- AND U.usuario_id = '9d131562-c443-43c1-af24-2a20356c44a4'
          )
          SELECT json_build_object(
              'type', 'FeatureCollection',
              'features', (
                  SELECT json_agg(feature)
                  FROM (
  
                      -- 1. LINESTRING: La ruta del lector (Línea Roja)
                      SELECT json_build_object(
                          'type', 'Feature',
                          'geometry', ST_AsGeoJSON(ST_MakeLine(ubicacion_captura ORDER BY fecha_lectura))::json,
                          'properties', json_build_object('tipo', 'ruta_lector', 'stroke', '#ff0000', 'stroke-width', 2)
                      ) AS feature
                      FROM lecturas_ordenadas
  
                      UNION ALL
  
                      -- 2. POINTS: Medidores/Casas (Puntos Azules)
                      SELECT json_build_object(
                          'type', 'Feature',
                          'geometry', ST_AsGeoJSON(coordenadas)::json,
                          'properties', json_build_object(
                              'tipo', 'medidor',
                              'clave_catastral', acometida_id,
                              'marker-color', '#0000ff'
                          )
                      )
                      FROM lecturas_ordenadas
  
                      UNION ALL
  
                      -- 3. POINTS: Capturas de las lecturas (Puntos Verdes, Inicial Negro, Final Naranja)
                      SELECT json_build_object(
                          'type', 'Feature',
                          'geometry', ST_AsGeoJSON(ubicacion_captura)::json,
                          'properties', json_build_object(
                              'tipo', CASE
                                          WHEN orden = 1 THEN 'punto_inicio'
                                          WHEN orden = total_lecturas THEN 'punto_final'
                                          ELSE 'captura'
                                      END,
                              'orden_visita', orden,
                              'es_inicio', orden = 1,
                              'es_fin', orden = total_lecturas,
                              'clave_catastral', clave_catastral,
                              'hora_lectura', hora_lectura,
                              'usuario_lectura', cedula,
                              'novedad', novedad,
                              'marker-color', CASE
                                                  WHEN orden = 1 THEN '#000000' -- Negro para el Inicio
                                                  WHEN orden = total_lecturas THEN '#ff9900' -- Naranja para el Fin
                                                  ELSE '#008000' -- Verde para los demás
                                              END,
                              'marker-size', CASE
                                                  WHEN orden = 1 OR orden = total_lecturas THEN 'medium'
                                                  ELSE 'small'
                                            END
                          )
                      )
                      FROM lecturas_ordenadas
  
                  ) AS todas_las_geometrias
              )
          ) AS map_geojson;
        `;

      const result = await this.databaseService.query<{
        geojson: MapRouteFeatureCollection;
      }>(query, params);
      return result[0]?.geojson || { type: 'FeatureCollection', features: [] };
    } catch (error) {
      console.error('Error fetching map geojson:', error);
      throw error;
    }
  }

  async getDetailedReadingInfoByCadastralKey(
    cadastralKey: string,
    yearAndMonth: string,
  ): Promise<ReadingInfoModel | null> {
    try {
      const query = /*sql*/ `
WITH vars AS (
    -- 0. AQUI DEFINES TU VARIABLE
    SELECT $1::varchar(10) AS cadastralKey,
           $2::varchar(7) AS yearAndMonth
),
ultima_lectura_valida AS (
    -- 1. Traemos la última lectura (añadidos novedad y observacion)
    SELECT
      l.lectura_id,
      l.acometida_id,
      l.fecha_lectura,
      l.hora_lectura,
      l.lectura_anterior,
      l.lectura_actual,
      l.valor_lectura,
      l.mes_lectura,
      l.novedad,      -- << Añadido para mostrar en el SELECT final
      l.observacion,  -- << Añadido para mostrar en el SELECT final
      date_trunc('month', l.fecha_lectura)::date AS mes_lectura_trunc,
      l.ubicacion_captura
    FROM lectura l
    WHERE l.acometida_id = (SELECT cadastralKey FROM vars)
      AND l.mes_lectura = (SELECT yearAndMonth FROM vars)
    ORDER BY l.fecha_lectura DESC
    LIMIT 1
),
mes_actual AS (
    SELECT date_trunc('month', CURRENT_DATE)::date AS mes_hoy
),
lectura_mes_actual_existe AS (
    SELECT
      EXISTS (
        SELECT 1 FROM lectura l
        WHERE l.acometida_id = (SELECT cadastralKey FROM vars)
          AND date_trunc('month', l.fecha_lectura)::date = date_trunc('month', CURRENT_DATE)::date
          AND l.novedad NOT ILIKE '%INICIAL AUTOMÁTICA%'
          AND l.novedad NOT ILIKE '%CAMBIO MEDIDOR%'
          AND l.novedad NOT ILIKE '%CAMBIO DE MEDIDOR%'
          AND l.mes_lectura = (SELECT yearAndMonth FROM vars)
      ) AS ya_tomada_mes_actual
),
proximo_mes_esperado AS (
    SELECT
      CASE
        WHEN MAX(l.mes_lectura) IS NULL THEN date_trunc('month', CURRENT_DATE)::date
        WHEN (to_date(MAX(l.mes_lectura), 'YYYY-MM') + INTERVAL '1 month')::date < date_trunc('month', CURRENT_DATE)::date
        THEN date_trunc('month', CURRENT_DATE)::date
        ELSE (to_date(MAX(l.mes_lectura), 'YYYY-MM') + INTERVAL '1 month')::date
      END AS mes_que_toca
    FROM lectura l
    WHERE l.acometida_id = (SELECT cadastralKey FROM vars)
      AND l.novedad NOT ILIKE '%INICIAL AUTOMÁTICA%'
      AND l.novedad NOT ILIKE '%CAMBIO MEDIDOR%'
      AND l.novedad NOT ILIKE '%CAMBIO DE MEDIDOR%'
      AND l.mes_lectura = (SELECT yearAndMonth FROM vars)
),
periodo AS (
    SELECT
      COALESCE(sl.fecha_inicio_periodo, CURRENT_DATE - INTERVAL '1 month') AS inicio,
      sl.fecha_siguiente_lectura AS fecha_mitad,
      COALESCE(sl.fecha_fin_periodo, CURRENT_DATE + INTERVAL '1 month') AS fin
    FROM siguiente_lectura sl
    WHERE sl.acometida_id = (SELECT cadastralKey FROM vars)
),
lectura_en_periodo AS (
    SELECT
      p.inicio,
      p.fin,
      (CURRENT_DATE BETWEEN p.inicio AND p.fin) AS en_periodo,
      EXISTS (
        SELECT 1 FROM lectura l2
        WHERE l2.acometida_id = (SELECT cadastralKey FROM vars)
          AND l2.fecha_lectura::date >= COALESCE(p.fecha_mitad, p.inicio)::date
          AND l2.novedad NOT ILIKE '%INICIAL AUTOMÁTICA%'
          AND l2.novedad NOT ILIKE '%CAMBIO MEDIDOR%'
          AND l2.novedad NOT ILIKE '%CAMBIO DE MEDIDOR%'
          AND l2.mes_lectura = (SELECT yearAndMonth FROM vars)
      ) AS ya_tomada_en_periodo_actual
    FROM periodo p
)

-- ==========================================
-- RESULTADO FINAL CON IMÁGENES Y CÁLCULOS
-- ==========================================
SELECT
  l.lectura_id AS "reading_id",
  l.fecha_lectura AS "previous_reading_date",
  l.hora_lectura AS "reading_time",
  ac.acometida_id AS "cadastral_key",
  c.cliente_id AS "card_id",
  COALESCE(ci.nombres || ' ' || ci.apellidos, e.razon_social) AS "client_name",
  cc.phones AS "client_phones",
  cc.correos AS "client_emails",
  ac.direccion AS address,
  l.lectura_anterior AS "previous_reading",
  l.lectura_actual AS "current_reading",
  l.valor_lectura AS "reading_value",
  ac.sector,
  ac.cuenta AS account,
  cp.average_consumption AS "average_consumption",
  ac.numero_medidor AS "meter_number",
  ac.tarifa_id AS "rate_id",
  ct.nombre AS "rate_name",

  -- ==========================================
  -- 📸 IMÁGENES Y CAMPOS SOLICITADOS
  -- ==========================================
  (
    SELECT jsonb_agg(
           json_build_object(
            'id', fl.foto_lectura_id,
            'path', fl.imagen_url,
            'novelty', fl.descripcion
           )
        )
    FROM foto_lectura fl
    WHERE fl.lectura_id = l.lectura_id
  ) AS "images",

  l.mes_lectura AS "reading_month",
  substring(l.mes_lectura FROM 1 FOR 4)::integer AS "reading_year",
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
  END AS "reading_month_name",
  l.novedad AS "novelty",
  (l.lectura_actual - l.lectura_anterior) AS "consumption",
  l.observacion AS "observation",
  -- ==========================================

  -- LÓGICA DE NEGOCIO
  CASE
    WHEN pme.mes_que_toca = ma.mes_hoy
         AND NOT COALESCE(lmae.ya_tomada_mes_actual, false)
    THEN true
    ELSE false
  END AS "has_current_reading",

  -- DEBUG
  pme.mes_que_toca AS "next_month_to_take_debug",
  ma.mes_hoy AS "current_month_debug",
  COALESCE(lmae.ya_tomada_mes_actual, false) AS "already_taken_current_month_debug",
  l.mes_lectura_trunc AS "reading_month_debug",
  lep.inicio AS "start_date_period",
  lep.fin AS "end_date_period",
  COALESCE(lep.en_periodo, false) AS "in_period_debug",
  est.id_estado AS "connection_state_id",
  est.nombre AS "connection_state_name",
  est.permite_lectura AS "permit_reading",
  CASE
    WHEN ac.coordenadas IS NOT NULL THEN
      json_build_object('lat', ST_Y(ac.coordenadas), 'lng', ST_X(ac.coordenadas))
      ELSE NULL
  END as "connection_location",
  CASE
    WHEN l.ubicacion_captura IS NOT NULL THEN
      json_build_object('lat', ST_Y(l.ubicacion_captura), 'lng', ST_X(l.ubicacion_captura))
      ELSE NULL
  END as "reading_location",
  (
    SELECT jsonb_agg(
        json_build_object(
            'id', ob.observacion_id,
            'title', ob.titulo_observacion,
            'observation', ob.detalle_observacion
        )
    ) FROM observacion ob inner join observacion_lectura ol
      on ob.observacion_id = ol.observacion_id
      where l.lectura_id = ol.lectura_id
  ) AS observations

FROM ultima_lectura_valida l
CROSS JOIN proximo_mes_esperado pme
CROSS JOIN mes_actual ma
CROSS JOIN lectura_mes_actual_existe lmae
LEFT JOIN periodo p ON true
LEFT JOIN lectura_en_periodo lep ON true
JOIN acometida ac ON ac.acometida_id = l.acometida_id
LEFT JOIN cat_estados_acometida est ON ac.estado_id = est.id_estado
LEFT JOIN cliente c ON c.cliente_id = ac.cliente_id
LEFT JOIN ciudadano ci ON ci.ciudadano_id = c.cliente_id
LEFT JOIN empresa e ON e.ruc = c.cliente_id
LEFT JOIN tarifa t ON t.tarifa_id = ac.tarifa_id
LEFT JOIN categoria ct ON ct.categoria_id = t.categoria_id
LEFT JOIN consumo_promedio cp ON cp.acometida_id = ac.acometida_id
LEFT JOIN cliente_contacto cc ON cc.cliente_id = c.cliente_id;
      `;

      const result = await this.databaseService.query<ReadingInfoModel>(query, [
        cadastralKey,
      ]);

      if (result.length === 0) {
        return null;
      }

      return result[0];
    } catch (error) {
      console.error('Error fetching detailed reading info:', error);
      throw error;
    }
  }
}
