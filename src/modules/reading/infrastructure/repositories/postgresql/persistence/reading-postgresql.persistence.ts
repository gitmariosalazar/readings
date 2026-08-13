import { InterfaceReadingRepository } from './../../../../domain/contracts/reading.interface.repository';
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

@Injectable()
export class ReadingPersistencePostgreSQL implements InterfaceReadingRepository {
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
            COALESCE(ci.nombres || ' ' || ci.apellidos, e.razon_social) AS "client_name",
            ac.direccion AS address,
            l.lectura_anterior AS "previous_reading",
            l.lectura_actual AS "current_reading",
            ac.sector,
            ac.cuenta AS account,
            l.valor_lectura AS "reading_value",
            cp.average_consumption AS "average_consumption",
            ac.numero_medidor AS "meter_number",
            ac.tarifa_id AS "rate_id",
            ct.nombre AS "rate_name",
            CASE
                WHEN l.ubicacion_captura IS NOT NULL THEN
                    json_build_object('lat', ST_Y(l.ubicacion_captura), 'lng', ST_X(l.ubicacion_captura))
                ELSE NULL
            END as "location_capture",
            CASE
                WHEN ac.coordenadas IS NOT NULL THEN
                    json_build_object('lat', ST_Y(ac.coordenadas), 'lng', ST_X(ac.coordenadas))
                ELSE NULL
            END as "location_connection",
            ST_Distance(l.ubicacion_captura::geography, ac.coordenadas::geography) as "distance_meters",
            CASE
                WHEN l.ubicacion_captura IS NOT NULL AND ac.coordenadas IS NOT NULL THEN
                    ST_DWithin(l.ubicacion_captura::geography, ac.coordenadas::geography, 15.0)
                ELSE false
            END as "is_inside_allowed_radius",
            CASE
                WHEN l.ubicacion_captura IS NOT NULL AND ac.coordenadas IS NOT NULL THEN
                    ST_AsGeoJSON(ST_MakeLine(ac.coordenadas, l.ubicacion_captura))::json
                ELSE NULL
            END as "distance_line_geojson"
        FROM acometida ac
            LEFT JOIN cliente c ON ac.cliente_id = c.cliente_id
            LEFT JOIN ciudadano ci ON ci.ciudadano_id = c.cliente_id
            LEFT JOIN empresa e ON e.ruc = c.cliente_id
            INNER JOIN lectura l ON l.acometida_id = ac.acometida_id
            INNER JOIN tarifa t on t.tarifa_id = ac.tarifa_id
            left join categoria ct on t.categoria_id = ct.categoria_id
            LEFT JOIN consumo_promedio cp ON cp.acometida_id = ac.acometida_id
            WHERE ac.acometida_id = $1 AND l.fecha_lectura IS NOT NULL
            ORDER BY l.fecha_lectura  DESC LIMIT 2;
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
        -- 1. Obtenemos de forma segura las últimas 5 lecturas reales
        SELECT
          l.lectura_id,
          l.acometida_id,
          l.fecha_lectura,
          l.hora_lectura,
          l.lectura_anterior,
          l.lectura_actual,
          l.valor_lectura,
          l.mes_lectura
        FROM (
          SELECT l.*
          FROM lectura l
          WHERE l.acometida_id = $1
            AND l.fecha_lectura IS NOT NULL
            AND l.novedad IS NOT NULL
            --AND l.novedad NOT LIKE '%INICIAL AUTOMÁTICA%'
            --AND l.novedad NOT LIKE '%CAMBIO MEDIDOR%'
          ORDER BY l.fecha_lectura DESC
          LIMIT 5
        ) l
      ),

      ranked AS (
        -- 2. Enumeramos para saber cuál es la última (rn=1) y la penúltima (rn=2)
        SELECT
          *,
          ROW_NUMBER() OVER (PARTITION BY acometida_id ORDER BY fecha_lectura DESC) AS rn,
          date_trunc('month', fecha_lectura)::date AS mes_lectura_trunc
        FROM ultima_lectura_valida
      ),

      mes_actual AS (
        -- 3. Fecha de control del mes en curso
        SELECT date_trunc('month', CURRENT_DATE)::date AS mes_hoy
      ),

      lectura_mes_actual_existe AS (
        -- 4. Bandera confiable: ¿Ya se digitó la lectura de este mes?
        SELECT
          EXISTS (
            SELECT 1
            FROM lectura l
            WHERE l.acometida_id = $1
              AND date_trunc('month', l.fecha_lectura)::date = date_trunc('month', CURRENT_DATE)::date
              AND l.novedad NOT ILIKE '%INICIAL AUTOMÁTICA%'
              AND l.novedad NOT ILIKE '%CAMBIO MEDIDOR%'
              AND l.novedad NOT ILIKE '%CAMBIO DE MEDIDOR%'
          ) AS ya_tomada_mes_actual
      ),

      proximo_mes_esperado AS (
        -- 5. Determinamos el mes teórico que toca basándonos en la cadena 'YYYY-MM'
        SELECT
          CASE
            -- Si no hay lecturas previas, toca el mes actual
            WHEN MAX(l.mes_lectura) IS NULL THEN date_trunc('month', CURRENT_DATE)::date

            -- Si el mes siguiente al histórico ya pasó, nos acoplamos al mes actual del servidor
            WHEN (to_date(MAX(l.mes_lectura), 'YYYY-MM') + INTERVAL '1 month')::date < date_trunc('month', CURRENT_DATE)::date
            THEN date_trunc('month', CURRENT_DATE)::date

            -- Si está al día, toca el mes consecutivo normal
            ELSE (to_date(MAX(l.mes_lectura), 'YYYY-MM') + INTERVAL '1 month')::date
          END AS mes_que_toca
        FROM lectura l
        WHERE l.acometida_id = $1
          AND l.novedad NOT ILIKE '%INICIAL AUTOMÁTICA%'
          AND l.novedad NOT ILIKE '%CAMBIO MEDIDOR%'
          AND l.novedad NOT ILIKE '%CAMBIO DE MEDIDOR%'
      ),

      periodo AS (
        -- 6. Rangos de control de la tabla Siguiente Lectura
        SELECT
          COALESCE(sl.fecha_inicio_periodo, CURRENT_DATE - INTERVAL '1 month') AS inicio,
          sl.fecha_siguiente_lectura AS fecha_mitad,
          COALESCE(sl.fecha_fin_periodo, CURRENT_DATE + INTERVAL '1 month') AS fin
        FROM siguiente_lectura sl
        WHERE sl.acometida_id = $1
      ),

      lectura_en_periodo AS (
        -- 7. Control secundario de periodo activo
        SELECT
          p.inicio,
          p.fin,
          (CURRENT_DATE BETWEEN p.inicio AND p.fin) AS en_periodo,
          EXISTS (
            SELECT 1
            FROM lectura l2
            WHERE l2.acometida_id = $1
              AND l2.fecha_lectura::date >= COALESCE(p.fecha_mitad, p.inicio)::date
              AND l2.novedad NOT ILIKE '%INICIAL AUTOMÁTICA%'
              AND l2.novedad NOT ILIKE '%CAMBIO MEDIDOR%'
              AND l2.novedad NOT ILIKE '%CAMBIO DE MEDIDOR%'
          ) AS ya_tomada_en_periodo_actual
        FROM periodo p
      )

      -- ==========================================
      -- RESULTADO FINAL COMPLEMENTADO Y SEGURO
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

        -- LÓGICA DE NEGOCIO SEGURA Y EDITABLE
        CASE
          -- Fila más reciente: Editable solo si toca este mes y no se ha tomado
          WHEN l.rn = 1
              AND pme.mes_que_toca = ma.mes_hoy
              AND NOT COALESCE(lmae.ya_tomada_mes_actual, false)

          THEN true

          -- Fila 2: Siempre permitida como referencia de edición
          WHEN l.rn = 2 THEN true

          ELSE false
        END AS "has_current_reading",

        -- Bloque de Debug para Auditoría Interna
        pme.mes_que_toca AS "next_month_to_take_debug",
        ma.mes_hoy AS "current_month_debug",
        COALESCE(lmae.ya_tomada_mes_actual, false) AS "already_taken_current_month_debug",
        l.mes_lectura_trunc AS "reading_month_debug",
        lep.inicio AS "start_date_period",
        lep.fin AS "end_date_period",
        COALESCE(lep.en_periodo, false) AS "in_period_debug",
        l.mes_lectura AS "month_reading",
        est.id_estado AS "connection_state_id",
        est.nombre AS "connection_state_name",
        est.permite_lectura AS "permit_reading",
        CASE
          WHEN ac.coordenadas IS NOT NULL THEN
            json_build_object('lat', ST_Y(ac.coordenadas), 'lng', ST_X(ac.coordenadas))
            ELSE NULL
          END as "connection_location"

      FROM ranked l
      -- Joins cruzados limpios que SIEMPRE devuelven 1 fila (nunca rompen el flujo)
      CROSS JOIN proximo_mes_esperado pme
      CROSS JOIN mes_actual ma
      CROSS JOIN lectura_mes_actual_existe lmae

      -- Joins condicionales seguros: Protegen la consulta si no hay datos de periodo
      LEFT JOIN periodo p ON true
      LEFT JOIN lectura_en_periodo lep ON true

      -- Entidades Principales
      JOIN acometida ac ON ac.acometida_id = l.acometida_id
      LEFT JOIN cat_estados_acometida est ON ac.estado_id = est.id_estado
      LEFT JOIN cliente c ON c.cliente_id = ac.cliente_id
      LEFT JOIN ciudadano ci ON ci.ciudadano_id = c.cliente_id
      LEFT JOIN empresa e ON e.ruc = c.cliente_id
      LEFT JOIN tarifa t ON t.tarifa_id = ac.tarifa_id
      LEFT JOIN categoria ct ON ct.categoria_id = t.categoria_id
      LEFT JOIN consumo_promedio cp ON cp.acometida_id = ac.acometida_id
      LEFT JOIN cliente_contacto cc ON cc.cliente_id = c.cliente_id

      WHERE l.rn <= 2
      ORDER BY l.fecha_lectura DESC;
    `;

    const result = await this.databaseService.query<ReadingInfoSQLResult>(
      query,
      [cadastralKey],
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
    const query: string = `SELECT EXISTS (SELECT 1 FROM lectura WHERE lectura_id = $1)`;
    const result = await this.databaseService.query<boolean[]>(query, [
      readingId,
    ]);
    return result[0] as unknown as boolean;
  }

  async updateCurrentReading(
    readingId: number,
    reading: ReadingModel,
    updateUserId: UUID,
  ): Promise<ReadingModel | null> {
    console.log(
      `Updating reading with ID: ${readingId}, Reading: ${JSON.stringify(reading)}, Update User ID: ${updateUserId}`,
    );

    return this.databaseService.transaction(async (client: IDatabaseClient) => {
      const updateQuery: string = `
        UPDATE lectura
        SET
            valor_lectura = $1,
            tasa_alcantarillado = $2,
            lectura_actual = $3,
            --codigo_ingreso_renta = $4,
            novedad = $4,
            --codigo_ingreso = $6,
            tipo_novedad_lectura_id = $5
        WHERE lectura_id = $6
        RETURNING
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
          codigo_lectura as "reading_code";
      `;
      const updateParams = [
        reading.readingValue ?? 0,
        reading.sewerRate ?? 0,
        reading.currentReading ?? 0,
        reading.novelty ?? 'NO NOVELTY',
        reading.typeNoveltyReadingId ?? 1,
        readingId,
      ];

      const rows = await client.query<ReadingSQLResult>(
        updateQuery,
        updateParams,
      );
      if (rows.length === 0) return null;

      await client.query(
        `INSERT INTO usuario_lectura(usuario_id, lectura_id, action_type_id) VALUES ($1, $2, (SELECT id FROM cat_action_types cat where cat.code LIKE '%UPDATE%' LIMIT 1))`,
        [updateUserId, readingId],
      );

      return ReadingSQLAdapter.fromReadingSQLResultToReadingModel(rows[0]);
    });
  }

  async createReading(
    reading: ReadingModel,
    creatorUserId: UUID,
  ): Promise<ReadingModel | null> {
    try {
      const acometidaId = reading.connectionId;

      const result = await this.databaseService.transaction(
        async (client: IDatabaseClient) => {
          // 1. Obtener IDs de estados
          const [pendRows, fuerRows, estadoAcometidaRows] = await Promise.all([
            client.query<any>(
              `SELECT lectura_estado_id FROM lectura_estado WHERE codigo = 'PEND' LIMIT 1;`,
            ),
            client.query<any>(
              `SELECT lectura_estado_id FROM lectura_estado WHERE codigo = 'FUER' LIMIT 1;`,
            ),
            client.query<any>(
              `
              SELECT est.permite_lectura, est.nombre AS estado_nombre
              FROM acometida ac
              JOIN cat_estados_acometida est ON ac.estado_id = est.id_estado
              WHERE ac.acometida_id = $1 LIMIT 1;
            `,
              [acometidaId],
            ),
          ]);

          if (estadoAcometidaRows.length === 0) {
            throw new RpcException({
              statusCode: statusCode.NOT_FOUND,
              message: `Acometida ${acometidaId} no existe.`,
            });
          }

          if (!estadoAcometidaRows[0].permite_lectura) {
            throw new RpcException({
              statusCode: statusCode.FORBIDDEN,
              message: `Estado "${estadoAcometidaRows[0].estado_nombre}" no permite lecturas.`,
            });
          }

          const pendId = pendRows[0]?.lectura_estado_id;
          const fuerId = fuerRows[0]?.lectura_estado_id;

          if (!pendId || !fuerId) {
            throw new RpcException({
              statusCode: 500,
              message: 'IDs de estado no encontrados.',
            });
          }

          // 2. Lógica de Fechas
          const timeZone = 'America/Guayaquil';
          const zonedDate = toZonedTime(new Date(), timeZone);
          const fechaLecturaInput = reading.readingDate ?? zonedDate;
          const mesLectura = zonedDate.toISOString().split('T')[0].slice(0, 7);

          // 3. Control de duplicados
          const countRows = await client.query<any>(
            `
            SELECT 
              COUNT(*) FILTER (WHERE novedad NOT LIKE '%INICIAL%' AND novedad NOT LIKE '%CAMBIO DE MEDIDOR%') AS normales,
              COUNT(*) FILTER (WHERE novedad LIKE '%INICIAL%' OR novedad LIKE '%CAMBIO DE MEDIDOR%') AS especiales
            FROM lectura
            WHERE acometida_id = $1 AND TO_CHAR(fecha_lectura, 'YYYY-MM') = $2 AND lectura_estado_id IS NOT NULL;
          `,
            [acometidaId, mesLectura],
          );

          const isEspecial =
            (reading.novelty ?? '').includes('INICIAL') ||
            (reading.novelty ?? '').includes('CAMBIO DE MEDIDOR');
          if (!isEspecial && parseInt(countRows[0].normales) >= 1) {
            throw new RpcException({
              statusCode: statusCode.CONFLICT,
              message: `Ya existe una lectura normal en ${mesLectura}.`,
            });
          }

          // 4. Consumo Promedio
          const avgRows = await client.query<any>(
            `SELECT average_consumption FROM consumo_promedio WHERE acometida_id = $1 LIMIT 1;`,
            [acometidaId],
          );
          const averageConsumption = parseFloat(
            avgRows[0]?.average_consumption || '0',
          );

          // <-- NUEVO: Obtener novedades dinámicas configuradas en la BD dentro de la transacción
          const noveltiesRows = await client.query<any>(
            `
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
          `,
            [],
          );

          const calculatedNovelty = getTypeCurrentConsumption(
            reading.previousReading,
            reading.currentReading,
            averageConsumption,
            noveltiesRows, // <-- Pasar las novedades obtenidas de la BD
          );

          // 5. Verificar Periodo
          const nextRows = await client.query<any>(
            `SELECT fecha_inicio_periodo, fecha_fin_periodo FROM siguiente_lectura WHERE acometida_id = $1;`,
            [acometidaId],
          );
          let estadoId = pendId;
          let observationFinal = reading.novelty || 'NORMAL';

          const hoy = new Date(fechaLecturaInput);
          hoy.setHours(0, 0, 0, 0);

          if (nextRows.length > 0) {
            const inicio = new Date(nextRows[0].fecha_inicio_periodo);
            const fin = new Date(nextRows[0].fecha_fin_periodo);
            if (hoy < inicio || hoy > fin) {
              estadoId = fuerId;
              observationFinal = 'LECTURA FUERA DE PERIODO';
            }
          }

          // 6. INSERT con RETURNING completo para el Adapter
          const insertQuery = /* sql */ `
            INSERT INTO lectura(
              acometida_id, fecha_lectura, hora_lectura, sector, cuenta, clave_catastral,
              valor_lectura, tasa_alcantarillado, lectura_anterior, lectura_actual,
              codigo_ingreso_renta, novedad, codigo_ingreso, tipo_novedad_lectura_id, lectura_estado_id, mes_lectura,observacion, ubicacion_captura
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17,
              CASE WHEN $18::double precision IS NOT NULL AND $19::double precision IS NOT NULL
                 THEN ST_SetSRID(ST_MakePoint($19, $18), 4326) ELSE NULL END
            )
            RETURNING
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
              (SELECT codigo FROM Lectura_estado WHERE lectura_estado_id = $15) as "status_code",
              CASE
                  WHEN ubicacion_captura IS NOT NULL THEN
                    json_build_object('lat', ST_Y(ubicacion_captura), 'lng', ST_X(ubicacion_captura))
                  ELSE NULL
                END as "location_capture",
                codigo_lectura as "reading_code";
          `;

          const horaLectura =
            reading.readingTime ||
            new Intl.DateTimeFormat('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              timeZone,
              hour12: false,
            }).format(new Date());

          const insertRows = await client.query<any>(insertQuery, [
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
            calculatedNovelty.title,
            reading.incomeCode ?? null,
            reading.typeNoveltyReadingId ?? 1,
            estadoId,
            mesLectura,
            observationFinal,
            reading.locationCapture?.lat ?? null,
            reading.locationCapture?.lng ?? null,
          ]);

          if (!insertRows[0]) throw new Error('Error al insertar la lectura.');

          // 7. Auditoría
          await client.query(
            `INSERT INTO usuario_lectura(usuario_id, lectura_id, action_type_id) VALUES ($1, $2, (SELECT id FROM cat_action_types cat where cat.code LIKE '%CREATE%' LIMIT 1))`,
            [creatorUserId, insertRows[0].reading_id],
          );

          return insertRows[0];
        },
      );

      const readingModel: ReadingModel =
        ReadingSQLAdapter.fromReadingSQLResultToReadingModel(result);
      return readingModel;
    } catch (error) {
      throw error;
    }
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
            l.lectura_id                  AS reading_id,
            l.acometida_id                AS connection_id,
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
            END                           AS reading_month,
            l.fecha_lectura               AS reading_date,
            l.hora_lectura                AS reading_time,
            l.lectura_anterior            AS previous_reading,
            l.lectura_actual              AS current_reading,
            (l.lectura_actual - l.lectura_anterior) AS consumption,
            l.novedad                     AS observation,
            l.valor_lectura               AS reading_value
        FROM lectura l
        WHERE l.acometida_id = $1
          AND l.fecha_lectura IS NOT NULL
          AND COALESCE(l.novedad, '')     !~* 'CAMBIO|INICIAL|MEDIDOR'
          AND COALESCE(l.observacion, '') !~* 'CAMBIO|INICIAL|MEDIDOR'
        ORDER BY l.fecha_lectura DESC
        LIMIT $2 OFFSET $3;
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
    return result.map((r) =>
      ReadingSQLAdapter.fromReadingPostgreSQLResultToReadingImagesModel(r),
    );
  }

  async findReadingsImagesByCadastralKey(
    cadastralKey: string,
  ): Promise<ReadingImagesModel[]> {
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
            fl.clave_catastral;
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
      sectorClause = `AND ac.sector = ANY($2)`;
      params.push(sectors);
    }

    const query = `
        SELECT  
            ac.acometida_id          AS cadastral_key,  
            ac.numero_medidor        AS meter_number,  
            ac.direccion             AS address,  
            ac.sector,  
            ac.cuenta                AS account,  
            ac.tarifa_id             AS rate_id,  
            ac.estado,  
            ct.nombre                AS rate_name,  
            COALESCE(
              ci.nombres || ' ' || ci.apellidos, 
              COALESCE(e.razon_social, e.nombre_comercial, 'Sin nombre registrado')
            )                        AS client_name,  
            c.cliente_id             AS card_id,  
            cp.average_consumption   AS average_consumption  
        FROM acometida ac  
            LEFT JOIN cliente c ON ac.cliente_id = c.cliente_id  
            LEFT JOIN ciudadano ci ON ci.ciudadano_id = c.cliente_id  
            LEFT JOIN empresa e ON e.ruc = c.cliente_id  
            LEFT JOIN tarifa t ON t.tarifa_id = ac.tarifa_id  
            LEFT JOIN categoria ct ON t.categoria_id = ct.categoria_id  
            LEFT JOIN consumo_promedio cp ON cp.acometida_id = ac.acometida_id
            -- Use cat_estados_acometida to determine readability (replaces legacy ac.estado boolean)
            JOIN cat_estados_acometida est ON ac.estado_id = est.id_estado
        WHERE NOT EXISTS (  
            SELECT 1  
            FROM lectura l  
            WHERE l.acometida_id = ac.acometida_id  
              AND l.mes_lectura = $1
        )  
          AND est.permite_lectura = TRUE
          ${sectorClause}
          AND ac.estado_id = 1
        ORDER BY ac.sector, ac.acometida_id;
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
      sectorClause = `AND ac.sector = ANY($${params.length + 1})`;
      params.push(sectors);
    }

    let userIdClause = '';
    if (userId) {
      userIdClause = `AND (u_creador.cedula = $${params.length + 1})`;
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
            COALESCE(ci.nombres || ' ' || ci.apellidos, COALESCE(e.razon_social, e.nombre_comercial)) AS client_name,
            c.cliente_id AS card_id,
            l.lectura_anterior AS previous_reading,
            l.lectura_actual AS current_reading,
            l.valor_lectura AS reading_value,
            coalesce(l.lectura_actual - l.lectura_anterior,0) AS calculated_consumption,
            cp.average_consumption AS average_consumption,
            ct.nombre AS rate_name,
            l.tipo_novedad_lectura_id AS reading_type,
            tnl.nombre as reading_type_name,
            l.novedad AS novelty,
            l.codigo_lectura AS reading_code,
            CASE
                WHEN l.ubicacion_captura IS NOT NULL THEN
                    json_build_object('lat', ST_Y(l.ubicacion_captura), 'lng', ST_X(l.ubicacion_captura))
                ELSE NULL
            END as "location_capture",
            CASE
                WHEN ac.coordenadas IS NOT NULL THEN
                    json_build_object('lat', ST_Y(ac.coordenadas), 'lng', ST_X(ac.coordenadas))
                ELSE NULL
            END as "location_connection",
            ST_Distance(l.ubicacion_captura::geography, ac.coordenadas::geography) as "distance_meters",
            CASE
                WHEN l.ubicacion_captura IS NOT NULL AND ac.coordenadas IS NOT NULL THEN
                    ST_DWithin(l.ubicacion_captura::geography, ac.coordenadas::geography, 15.0)
                ELSE false
            END as "is_inside_allowed_radius",
            CASE
                WHEN l.ubicacion_captura IS NOT NULL AND ac.coordenadas IS NOT NULL THEN
                    ST_AsGeoJSON(ST_MakeLine(ac.coordenadas, l.ubicacion_captura))::json
                ELSE NULL
            END as "distance_line_geojson",
            -- Información del usuario creador/recolector
            u_creador.cedula AS creator_card_id,
            u_creador.nombres AS creator_first_name,
            u_creador.apellidos AS creator_last_name,

            -- Información del usuario actualizador (si aplica)
            u_actualizador.cedula AS updater_card_id,
            u_actualizador.nombres AS updater_first_name,
            u_actualizador.apellidos AS updater_last_name
        FROM lectura l
            INNER JOIN acometida ac ON ac.acometida_id = l.acometida_id
            LEFT JOIN cliente c ON ac.cliente_id = c.cliente_id
            LEFT JOIN ciudadano ci ON ci.ciudadano_id = c.cliente_id
            LEFT JOIN empresa e ON e.ruc = c.cliente_id
            LEFT JOIN tarifa t ON t.tarifa_id = ac.tarifa_id
            LEFT JOIN categoria ct ON t.categoria_id = ct.categoria_id
            LEFT JOIN consumo_promedio cp ON cp.acometida_id = ac.acometida_id
            LEFT JOIN public.tipo_novedad_lectura tnl on tnl.tipo_novedad_lectura_id = l.tipo_novedad_lectura_id

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
        WHERE l.mes_lectura = $1
            ${sectorClause}
            ${userIdClause}
        ORDER BY l.fecha_lectura DESC;
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
    const dateMonthFormatted = dateMonth.replace('/', '-');
    const params: any[] = [dateMonthFormatted];
    let sectorClause = '';
    if (sector != null) {
      const sectors = Array.isArray(sector) ? sector : [sector];
      sectorClause = `AND ac.sector = ANY($${params.length + 1})`;
      params.push(sectors);
    }

    let userIdClause = '';
    if (userId) {
      userIdClause = `AND u_creador.cedula = $${params.length + 1}`;
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
            COALESCE(ci.nombres || ' ' || ci.apellidos, COALESCE(e.razon_social, e.nombre_comercial)) AS client_name,
            c.cliente_id AS card_id,
            l.lectura_anterior AS previous_reading,
            l.lectura_actual AS current_reading,
            l.valor_lectura AS reading_value,
            coalesce(l.lectura_actual - l.lectura_anterior,0) AS calculated_consumption,
            cp.average_consumption AS average_consumption,
            ct.nombre AS rate_name,
            l.tipo_novedad_lectura_id AS reading_type,
            tnl.nombre as reading_type_name,
            l.novedad AS novelty,
            CASE
                WHEN l.ubicacion_captura IS NOT NULL THEN
                    json_build_object('lat', ST_Y(l.ubicacion_captura), 'lng', ST_X(l.ubicacion_captura))
                ELSE NULL
            END as "location_capture",
            CASE
                WHEN ac.coordenadas IS NOT NULL THEN
                    json_build_object('lat', ST_Y(ac.coordenadas), 'lng', ST_X(ac.coordenadas))
                ELSE NULL
            END as "location_connection",
            ST_Distance(l.ubicacion_captura::geography, ac.coordenadas::geography) as "distance_meters",
            CASE
                WHEN l.ubicacion_captura IS NOT NULL AND ac.coordenadas IS NOT NULL THEN
                    ST_DWithin(l.ubicacion_captura::geography, ac.coordenadas::geography, 15.0)
                ELSE false
            END as "is_inside_allowed_radius",
            CASE
                WHEN l.ubicacion_captura IS NOT NULL AND ac.coordenadas IS NOT NULL THEN
                    ST_AsGeoJSON(ST_MakeLine(ac.coordenadas, l.ubicacion_captura))::json
                ELSE NULL
            END as "distance_line_geojson",
            l.codigo_lectura AS reading_code,
            -- Información del usuario creador/recolector
            u_creador.cedula AS creator_card_id,
            u_creador.nombres AS creator_first_name,
            u_creador.apellidos AS creator_last_name,

            -- Información del usuario actualizador (si aplica)
            u_actualizador.cedula AS updater_card_id,
            u_actualizador.nombres AS updater_first_name,
            u_actualizador.apellidos AS updater_last_name
        FROM lectura l
            INNER JOIN acometida ac ON ac.acometida_id = l.acometida_id
            LEFT JOIN cliente c ON ac.cliente_id = c.cliente_id
            LEFT JOIN ciudadano ci ON ci.ciudadano_id = c.cliente_id
            LEFT JOIN empresa e ON e.ruc = c.cliente_id
            LEFT JOIN tarifa t ON t.tarifa_id = ac.tarifa_id
            LEFT JOIN categoria ct ON t.categoria_id = ct.categoria_id
            LEFT JOIN consumo_promedio cp ON cp.acometida_id = ac.acometida_id
            LEFT JOIN public.tipo_novedad_lectura tnl on tnl.tipo_novedad_lectura_id = l.tipo_novedad_lectura_id

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
        WHERE l.mes_lectura = $1
            ${sectorClause}
            ${userIdClause}
            AND l.tipo_novedad_lectura_id = 9
        ORDER BY l.fecha_lectura DESC;
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

  async getReadingByNovelty(
    dateMonth: string,
    novelty?: string,
    sector?: number,
    userId?: string | null,
  ): Promise<ReadingNoveltyModel[]> {
    const dateMonthFormatted = dateMonth.replace('/', '-');

    // El arreglo inicia solo con el $1 obligatorio
    const params: any[] = [dateMonthFormatted];
    let paramIndex = 2; // $1 ya lo ocupa dateMonthFormatted
    let noveltyClause = '';
    if (novelty) {
      // Usamos el número actual y luego lo incrementamos
      noveltyClause = `AND l.novedad ILIKE $${paramIndex}`;
      params.push(`%${novelty}%`);
      paramIndex++;
    } else {
      noveltyClause = `AND l.novedad IS NOT NULL AND l.novedad <> ''`;
    }
    let sectorClause = '';
    if (sector != null) {
      // Usamos el número que toque (puede ser $2 o $3 dependiendo de si entró la novedad)
      sectorClause = `AND ac.sector = $${paramIndex}`;
      params.push(sector);
      paramIndex++;
    }

    let userIdClause = '';
    if (userId) {
      userIdClause = `AND u_creador.cedula = $${paramIndex}`;
      params.push(userId);
      paramIndex++;
    }

    const query = /*sql*/ `
        SELECT
            l.lectura_id AS                           reading_id,
            l.fecha_lectura AS                        reading_date,
            l.mes_lectura AS                          reading_month,
            l.hora_lectura AS                         reading_time,
            ac.acometida_id AS                        cadastral_key,
            ac.numero_medidor AS                      meter_number,
            ac.direccion AS                           address,
            ac.sector,
            ac.cuenta AS                              account,
            COALESCE(ci.nombres || ' ' || ci.apellidos, COALESCE(e.razon_social, e.nombre_comercial)) AS client_name,
            c.cliente_id AS                           card_id,
            l.lectura_anterior AS                     previous_reading,
            l.lectura_actual AS                       current_reading,
            l.valor_lectura AS                        reading_value,
            coalesce(l.lectura_actual - l.lectura_anterior,0) AS calculated_consumption,
            cp.average_consumption AS                 average_consumption,
            ct.nombre AS                              rate_name,
            l.tipo_novedad_lectura_id AS              reading_type_id,
            tnl.nombre as                             reading_type_name,
            l.novedad AS                              novelty,
            tnl.tipo_novedad_lectura_id AS            type_novelty_reading_id,
            tnl.nombre AS                             type_novelty_reading_name,
            tnl.descripcion AS                        type_novelty_reading_description,
            CASE
                WHEN L.ubicacion_captura IS NOT NULL THEN
                    json_build_object('lat', ST_Y(L.ubicacion_captura), 'lng', ST_X(L.ubicacion_captura))
                ELSE NULL
            END AS location_capture,
            CASE
                WHEN ac.coordenadas IS NOT NULL THEN
                    json_build_object('lat', ST_Y(ac.coordenadas), 'lng', ST_X(ac.coordenadas))
                ELSE NULL
            END AS location_connection,
            ST_Distance(l.ubicacion_captura::geography, ac.coordenadas::geography) AS distance_meters,
            CASE
                WHEN l.ubicacion_captura IS NOT NULL AND ac.coordenadas IS NOT NULL THEN
                    ST_DWithin(l.ubicacion_captura::geography, ac.coordenadas::geography, 15.0)
                ELSE false
            END AS is_inside_allowed_radius,
            CASE
                WHEN l.ubicacion_captura IS NOT NULL AND ac.coordenadas IS NOT NULL THEN
                    ST_AsGeoJSON(ST_MakeLine(ac.coordenadas, l.ubicacion_captura))::json
                ELSE NULL
            END AS distance_line_geojson,
            ARRAY_AGG(fl.imagen_url)     AS images,
            l.codigo_lectura AS reading_code,
            -- Información del usuario creador/recolector
            u_creador.cedula AS creator_card_id,
            u_creador.nombres AS creator_first_name,
            u_creador.apellidos AS creator_last_name,

            -- Información del usuario actualizador (si aplica)
            u_actualizador.cedula AS updater_card_id,
            u_actualizador.nombres AS updater_first_name,
            u_actualizador.apellidos AS updater_last_name
        FROM lectura l
            INNER JOIN acometida ac ON ac.acometida_id = l.acometida_id
            LEFT JOIN cliente c ON ac.cliente_id = c.cliente_id
            LEFT JOIN ciudadano ci ON ci.ciudadano_id = c.cliente_id
            LEFT JOIN empresa e ON e.ruc = c.cliente_id
            LEFT JOIN tarifa t ON t.tarifa_id = ac.tarifa_id
            LEFT JOIN categoria ct ON t.categoria_id = ct.categoria_id
            LEFT JOIN consumo_promedio cp ON cp.acometida_id = ac.acometida_id
            LEFT JOIN public.tipo_novedad_lectura tnl on tnl.tipo_novedad_lectura_id = l.tipo_novedad_lectura_id
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
        WHERE l.mes_lectura = $1
            ${noveltyClause}
            ${sectorClause}
            ${userIdClause}
            GROUP BY
            l.lectura_id,
            l.fecha_lectura,
            l.mes_lectura,
            l.hora_lectura,
            ac.acometida_id,
            ac.numero_medidor,
            ac.direccion,
            ac.sector,
            ac.cuenta,
            ci.nombres,
            ci.apellidos,
            e.razon_social,
            e.nombre_comercial,
            c.cliente_id,
            l.lectura_anterior,
            l.lectura_actual,
            l.valor_lectura,
            cp.average_consumption,
            ct.nombre,
            l.tipo_novedad_lectura_id,
            tnl.nombre,
            l.novedad,
            tnl.tipo_novedad_lectura_id,
            tnl.nombre,
            tnl.descripcion,
            l.ubicacion_captura,
            ac.coordenadas,
            u_creador.cedula,
            u_creador.nombres,
            u_creador.apellidos,
            u_actualizador.cedula,
            u_actualizador.nombres,
            u_actualizador.apellidos,
            l.codigo_lectura
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
      // 1. Obtener la tarifa de la acometida
      if (consumptionM3 < 0) {
        return 0;
      }
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

      console.log(
        `Valor a pagar calculado para la clave catastral '${cadastralKey}': ${valorPagar} (Consumo: ${consumptionM3} m³, Tarifa: ${tarifa}, Rango: ${min}-${max}, Base: ${bas}, Adicional: ${adic})`,
      );

      return valorPagar;
    } catch (error) {
      console.error('Error al calcular ValorPagarConsumo:', error);
      throw error; // o retornar 0 según tu política
    }
  }
}
