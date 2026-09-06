import { InterfaceReadingRepository } from './../../../../domain/contracts/reading.interface.repository';
import { Injectable } from '@nestjs/common';
import { toZonedTime } from 'date-fns-tz';
import {
  PendingReadingConnectionSQLResult,
  RangoTarifaSQLResult,
  ReadingBasicInfoSQLResult,
  ReadingDetailedSQLResult,
  ReadingHistorySQLResult,
  ReadingImagesSQLResult,
  ReadingInfoSQLResult,
  ReadingNoveltySQLResult,
  ReadingSQLResult,
  TakenReadingConnectionSQLResult,
  TarifaSQLResult,
} from '../../../interfaces/sql/reading-sql.result.interface';
import { ReadingAdjustmentModel } from '../../../../domain/schemas/model/reading-adjustment.model';
import { ReadingSQLAdapter } from '../../../adapters/reading-sql.adapter';
import {
  DatabaseAbstract,
  IDatabaseClient,
} from '../../../../../../shared/connections/database/abstract/abstract.database';
import { ReadingBasicInfoModel } from '../../../../domain/schemas/model/reading-basic-info.model';
import {
  ReadingDetailedModel,
  ReadingInfoModel,
} from '../../../../domain/schemas/model/reading-info.model';
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
export class ReadingPersistencePostgreSQL implements InterfaceReadingRepository {
  constructor(private readonly databaseService: DatabaseAbstract) {}

  async findReadingBasicInfo(
    cadastralKey: string,
  ): Promise<ReadingBasicInfoModel[]> {
    const query: string = /*sql*/ `
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
    const query: string = /*sql*/ `
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
    auditData?: ReadingAdjustmentModel,
  ): Promise<ReadingModel | null> {
    console.log(
      `Updating reading with ID: ${readingId}, Reading: ${JSON.stringify(reading)}, Update User ID: ${updateUserId}`,
    );

    return this.databaseService.transaction(async (client: IDatabaseClient) => {
      const oldReadingQuery = `SELECT lectura_anterior, lectura_actual FROM lectura WHERE lectura_id = $1`;
      const oldReadingResult = await client.query<any>(oldReadingQuery, [
        readingId,
      ]);
      if (oldReadingResult.length === 0) return null;

      const lecturaAnteriorPrevia =
        Number(oldReadingResult[0].lectura_anterior) || 0;
      const lecturaActualPrevia =
        Number(oldReadingResult[0].lectura_actual) || 0;
      const consumoPrevio = lecturaActualPrevia - lecturaAnteriorPrevia;

      const lecturaAnteriorNueva =
        auditData?.lecturaAnteriorNueva ?? lecturaAnteriorPrevia;
      const lecturaActualNueva =
        auditData?.lecturaActualNueva ?? lecturaActualPrevia;
      const consumoNuevo = lecturaActualNueva - lecturaAnteriorNueva;

      const updateQuery: string = `
        UPDATE lectura
        SET
            valor_lectura = $1,
            tasa_alcantarillado = $2,
            lectura_actual = $3,
            novedad = $4,
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

      if (auditData) {
        const auditQuery = `
          INSERT INTO historial_ajuste_lectura (
            lectura_id, tipo_ajuste_id,
            lectura_anterior_previa, lectura_actual_previa, consumo_previo,
            lectura_anterior_nueva, lectura_actual_nueva, consumo_nuevo,
            justificacion, usuario_id
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `;
        await client.query(auditQuery, [
          readingId,
          auditData.tipoAjusteId,
          lecturaAnteriorPrevia,
          lecturaActualPrevia,
          consumoPrevio,
          lecturaAnteriorNueva,
          lecturaActualNueva,
          consumoNuevo,
          auditData.justificacion ?? 'Actualización Normal',
          auditData.usuarioId,
        ]);
      }

      return ReadingSQLAdapter.fromReadingSQLResultToReadingModel(rows[0]);
    });
  }

  async updateSpecialReading(
    readingId: number,
    reading: ReadingModel,
    auditData: ReadingAdjustmentModel,
  ): Promise<ReadingModel | null> {
    console.log(
      `Special updating reading with ID: ${readingId}, Reading: ${JSON.stringify(reading)}, AuditData: ${JSON.stringify(auditData)}`,
    );

    return this.databaseService.transaction(async (client: IDatabaseClient) => {
      const oldReadingQuery = `SELECT lectura_anterior, lectura_actual FROM lectura WHERE lectura_id = $1`;
      const oldReadingResult = await client.query<any>(oldReadingQuery, [
        readingId,
      ]);
      if (oldReadingResult.length === 0) return null;

      const lecturaAnteriorPrevia =
        Number(oldReadingResult[0].lectura_anterior) || 0;
      const lecturaActualPrevia =
        Number(oldReadingResult[0].lectura_actual) || 0;
      const consumoPrevio = lecturaActualPrevia - lecturaAnteriorPrevia;

      const lecturaAnteriorNueva = auditData.lecturaAnteriorNueva ?? 0;
      const lecturaActualNueva = auditData.lecturaActualNueva ?? 0;
      const consumoNuevo = lecturaActualNueva - lecturaAnteriorNueva;

      const updateQuery: string = `
        UPDATE lectura
        SET
            valor_lectura = $1,
            tasa_alcantarillado = $2,
            lectura_actual = $3,
            lectura_anterior = $4,
            novedad = $5,
            tipo_novedad_lectura_id = $6
        WHERE lectura_id = $7
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
        reading.previousReading ?? 0,
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
        [auditData.usuarioId, readingId],
      );

      const auditQuery = `
        INSERT INTO historial_ajuste_lectura (
          lectura_id, tipo_ajuste_id,
          lectura_anterior_previa, lectura_actual_previa, consumo_previo,
          lectura_anterior_nueva, lectura_actual_nueva, consumo_nuevo,
          justificacion, usuario_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `;
      await client.query(auditQuery, [
        readingId,
        auditData.tipoAjusteId,
        lecturaAnteriorPrevia,
        lecturaActualPrevia,
        consumoPrevio,
        lecturaAnteriorNueva,
        lecturaActualNueva,
        consumoNuevo,
        auditData.justificacion,
        auditData.usuarioId,
      ]);

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
          const [realRows, fuerRows, estadoAcometidaRows] = await Promise.all([
            client.query<any>(
              `SELECT lectura_estado_id FROM lectura_estado WHERE codigo = 'REAL' LIMIT 1;`,
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

          const realId = realRows[0]?.lectura_estado_id;
          const fuerId = fuerRows[0]?.lectura_estado_id;

          if (!realId || !fuerId) {
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
          let estadoId = realId;
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
    const query: string = /*sql*/ `
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
    const query: string = /*sql*/ `
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
    const query: string = /*sql*/ `
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

    const query = /*sql*/ `
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
            u_actualizador.apellidos AS updater_last_name,
            ac.estado_actualizacion AS updated_status
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

            -- Join específico para obtener el ÚLTIMO USUARIO ACTUALIZADOR / MODIFICADOR
            LEFT JOIN LATERAL (
                SELECT * FROM usuario_lectura
                WHERE lectura_id = l.lectura_id AND action_type_id = 2
                ORDER BY usuario_lectura_id DESC
                LIMIT 1
            ) ulu ON true
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

            -- Join específico para obtener el ÚLTIMO USUARIO ACTUALIZADOR / MODIFICADOR
            LEFT JOIN LATERAL (
                SELECT * FROM usuario_lectura
                WHERE lectura_id = l.lectura_id AND action_type_id = 2
                ORDER BY usuario_lectura_id DESC
                LIMIT 1
            ) ulu ON true
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

            -- Join específico para obtener el ÚLTIMO USUARIO ACTUALIZADOR / MODIFICADOR
            LEFT JOIN LATERAL (
                SELECT * FROM usuario_lectura
                WHERE lectura_id = l.lectura_id AND action_type_id = 2
                ORDER BY usuario_lectura_id DESC
                LIMIT 1
            ) ulu ON true
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

  async getMapGeojsonByDayAndByUser(
    date: string,
    userId?: string,
  ): Promise<MapRouteFeatureCollection> {
    try {
      const params: any[] = [date];
      let userIdClause = '';
      if (userId && userId !== 'ALL') {
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
                -- Numeramos las lecturas cronológicamente (1, 2, 3...) por usuario
                ROW_NUMBER() OVER(PARTITION BY emp.cedula ORDER BY l.fecha_lectura ASC) AS orden,
                -- Contamos el total para poder detectar cuál es la última por usuario
                COUNT(*) OVER(PARTITION BY emp.cedula) AS total_lecturas
            FROM lectura l
            JOIN acometida a ON l.acometida_id = a.acometida_id
            LEFT JOIN LATERAL (
                SELECT * FROM usuario_lectura
                WHERE lectura_id = l.lectura_id
                ORDER BY usuario_lectura_id DESC
                LIMIT 1
            ) u ON true
            LEFT JOIN empleados emp on emp.usuario_id = u.usuario_id
            WHERE l.ubicacion_captura IS NOT NULL
              AND a.coordenadas IS NOT NULL
              AND DATE(l.fecha_lectura) = $1
              ${userIdClause}
        )
        SELECT json_build_object(
            'type', 'FeatureCollection',
            'features', COALESCE((
                SELECT json_agg(feature)
                FROM (

                    -- 1. LINESTRING: La ruta del lector separada por usuario (Línea Roja/Diferente color)
                    SELECT json_build_object(
                        'type', 'Feature',
                        'geometry', ST_AsGeoJSON(ST_MakeLine(ubicacion_captura ORDER BY fecha_lectura))::json,
                        'properties', json_build_object(
                            'tipo', 'ruta_lector', 
                            'usuario_lectura', cedula, 
                            'fecha_lectura', DATE(MAX(fecha_lectura)),
                            'stroke', CASE 
                                          WHEN cedula IS NULL THEN '#ff0000'
                                          ELSE '#' || substring(md5(cedula) from 1 for 6) 
                                      END, 
                            'stroke-width', 3
                        )
                    ) AS feature
                    FROM lecturas_ordenadas
                    GROUP BY cedula
                    HAVING count(ubicacion_captura) > 0

                    UNION ALL

                    -- 2. POINTS: Medidores/Casas (Puntos Azules)
                    SELECT json_build_object(
                        'type', 'Feature',
                        'geometry', ST_AsGeoJSON(coordenadas)::json,
                        'properties', json_build_object(
                            'tipo', 'medidor',
                            'clave_catastral', acometida_id,
                            'usuario_lectura', cedula,
                            'fecha_lectura', fecha_lectura,
                            'marker-color', '#3b82f6' -- Azul estándar
                        )
                    )
                    FROM lecturas_ordenadas

                    UNION ALL

                    -- 3. POINTS: Capturas de las lecturas (Puntos de colores según usuario)
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
                            'fecha_lectura', fecha_lectura,
                            'novedad', novedad,
                            'marker-color', CASE
                                                WHEN orden = 1 THEN '#000000' -- Negro para el Inicio
                                                WHEN orden = total_lecturas THEN '#ff9900' -- Naranja para el Fin
                                                ELSE CASE 
                                                          WHEN cedula IS NULL THEN '#10b981'
                                                          ELSE '#' || substring(md5(cedula) from 1 for 6) 
                                                     END
                                            END,
                            'marker-size', CASE
                                                WHEN orden = 1 OR orden = total_lecturas THEN 'medium'
                                                ELSE 'small'
                                          END
                        )
                    )
                    FROM lecturas_ordenadas

                ) AS todas_las_geometrias
            ), '[]'::json)
        ) AS map_geojson;
      `;

      const result = await this.databaseService.query<{
        map_geojson: MapRouteFeatureCollection;
      }>(query, params);
      return (
        result[0]?.map_geojson || { type: 'FeatureCollection', features: [] }
      );
    } catch (error) {
      console.error('Error fetching map geojson:', error);
      throw error;
    }
  }

  async getDetailedReadingInfoByCadastralKey(
    cadastralKey: string,
    yearAndMonth: string,
  ): Promise<ReadingDetailedModel | null> {
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
  l.fecha_lectura AS "reading_date",
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

      const result = await this.databaseService.query<ReadingDetailedSQLResult>(
        query,
        [cadastralKey, yearAndMonth],
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: 404,
          message: `No se encontró información de lectura para la clave catastral '${cadastralKey}' y mes '${yearAndMonth}'.`,
        });
      }

      return result.map((r) =>
        ReadingSQLAdapter.fromReadingPostgreSQLResultToReadingDetailedModel(r),
      )[0];
    } catch (error) {
      console.error('Error fetching detailed reading info:', error);
      throw error;
    }
  }

  async generateInitialReadingOnMeterChange(
    acometidaId: string,
    nuevoNumeroMedidor: string,
    sector: number,
    cuenta: number,
    claveCatastral: string,
    fechaInicioLecturas: Date | string,
  ): Promise<void> {
    await this.databaseService.transaction(async (client: IDatabaseClient) => {
      // 1. Obtener ID del estado PEND
      const stateQuery = `SELECT lectura_estado_id FROM lectura_estado WHERE codigo = 'PEND' LIMIT 1;`;
      const stateResult = await client.query<{ lectura_estado_id: number }>(
        stateQuery,
      );
      if (!stateResult || stateResult.length === 0) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Estado PEND no encontrado',
        });
      }
      const pendId = stateResult[0].lectura_estado_id;

      console.log(
        'pendId:',
        pendId,
        'acometidaId:',
        acometidaId,
        'nuevoNumeroMedidor:',
        nuevoNumeroMedidor,
      );

      // 2. Buscar si ya existe una lectura en estado PEND para esta acometida
      const findQuery = `
        SELECT lectura_id 
        FROM lectura 
        WHERE acometida_id = $1
        -- AND lectura_estado_id = $2
        ORDER BY fecha_lectura DESC, lectura_id DESC 
        LIMIT 1;
      `;
      const findResult = await client.query<{ lectura_id: number }>(findQuery, [
        acometidaId,
        //pendId,
      ]);

      let v_lectura_id: number;
      let novedad = `LECTURA INICIAL POR CAMBIO DE MEDIDOR: ${nuevoNumeroMedidor}`;

      console.log('findResult:', findResult);

      if (findResult.length > 0 && findResult[0].lectura_id) {
        v_lectura_id = findResult[0].lectura_id;
        console.log('Existing PEND reading found, updating it.', v_lectura_id);
        novedad = `ACTUALIZACIÓN DE LECTURA POR CAMBIO DE MEDIDOR: ${nuevoNumeroMedidor}`;
        const updateQuery = `
          UPDATE lectura
          SET nota_adicional = $1,
              updated_at = NOW()
          WHERE lectura_id = $2;
        `;
        await client.execute(updateQuery, [novedad, v_lectura_id]);
      } else {
        console.log('No existing PEND reading found, inserting new one.');
        const insertQuery = `
          INSERT INTO lectura (
            acometida_id, fecha_lectura, hora_lectura, sector, cuenta, clave_catastral,
            valor_lectura, tasa_alcantarillado, lectura_anterior, lectura_actual,
            novedad, tipo_novedad_lectura_id, lectura_estado_id
          ) VALUES (
            $1, CURRENT_DATE, CURRENT_TIME, $2, $3, $4, 0, 0, 0, 0, $5, 8, $6
          ) RETURNING lectura_id;
        `;
        const insertResult = await client.query<{ lectura_id: number }>(
          insertQuery,
          [acometidaId, sector, cuenta, claveCatastral, novedad, pendId],
        );
        v_lectura_id = insertResult[0].lectura_id;
      }

      // 3. Contar lecturas completadas (REAL o FACT)
      const countQuery = `
        SELECT COUNT(*) as count_completadas
        FROM lectura l
        JOIN lectura_estado le ON le.lectura_estado_id = l.lectura_estado_id
        WHERE l.acometida_id = $1 AND le.codigo IN ('REAL', 'FACT');
      `;
      const countResult = await client.query<{ count_completadas: string }>(
        countQuery,
        [acometidaId],
      );
      const countCompletadas = parseInt(countResult[0].count_completadas, 10);

      // 4. Calcular e insertar en siguiente_lectura
      const upsertSiguienteLecturaQuery = `
        WITH calc AS (
          SELECT ($2::date + (INTERVAL '1 month' * ($3::int + 1))) AS proxima_ideal
        )
        INSERT INTO siguiente_lectura (
            acometida_id,
            ultima_lectura_id,
            fecha_siguiente_lectura,
            fecha_inicio_periodo,
            fecha_fin_periodo
        ) 
        SELECT 
            $1, 
            $4, 
            proxima_ideal, 
            date_trunc('month', proxima_ideal), 
            (date_trunc('month', proxima_ideal) + INTERVAL '1 month' - INTERVAL '1 day')
        FROM calc
        ON CONFLICT (acometida_id) DO UPDATE SET
            ultima_lectura_id = EXCLUDED.ultima_lectura_id,
            fecha_siguiente_lectura = EXCLUDED.fecha_siguiente_lectura,
            fecha_inicio_periodo = EXCLUDED.fecha_inicio_periodo,
            fecha_fin_periodo = EXCLUDED.fecha_fin_periodo;
      `;

      const fechaBaseStr =
        fechaInicioLecturas instanceof Date
          ? fechaInicioLecturas.toISOString()
          : fechaInicioLecturas;

      await client.execute(upsertSiguienteLecturaQuery, [
        acometidaId,
        fechaBaseStr,
        countCompletadas,
        v_lectura_id,
      ]);
    });
  }
}
