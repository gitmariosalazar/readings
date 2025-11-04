import { InterfaceReadingRepository } from './../../../../domain/contracts/reading.interface.repository';
import { Injectable } from "@nestjs/common";
import { ReadingBasicInfoSQLResult, ReadingSQLResult } from '../../../interfaces/sql/reading-sql.result.interface';
import { ReadingPostgreSQLAdapter } from '../adapters/reading-postgresql.adapter';
import { DatabaseServicePostgreSQL } from '../../../../../../shared/connections/database/postgresql/postgresql.service';
import { ReadingBasicInfoResponse, ReadingInfoResponse } from '../../../../domain/schemas/dto/response/reading-basic.response';
import { ReadingModel } from '../../../../domain/schemas/model/reading.model';
import { ReadingResponse } from '../../../../domain/schemas/dto/response/reading.response';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from '../../../../../../settings/environments/status-code';

@Injectable()
export class ReadingPersistencePostgreSQL implements InterfaceReadingRepository {
  constructor(
    private readonly postgresqlService: DatabaseServicePostgreSQL
  ) { }

  async findReadingBasicInfo(cadastralKey: string): Promise<ReadingBasicInfoResponse[]> {
    try {
      const query: string = `
        SELECT
            l.lecturaid AS "readingId",
            l.fechalectura AS "previousReadingDate",
            ac.acometidaid AS "cadastralKey",
            c.clienteid AS "cardId",
            COALESCE(ci.nombres || ' ' || ci.apellidos, e.razonsocial) AS "clientName",
            ac.direccion AS address,
            l.lecturaanterior AS "previousReading",
            l.lecturaactual AS "currentReading",
            ac.sector,
            ac.cuenta AS account,
            l.valorlectura AS "readingValue",
            cp.average_consumption AS "averageConsumption",
            ac.numeromedidor AS "meterNumber",
            ac.tarifaid AS "rateId",
            t.nombre AS "rateName"
        FROM acometida ac
            LEFT JOIN cliente c ON ac.clienteid = c.clienteid
            LEFT JOIN ciudadano ci ON ci.ciudadanoid = c.clienteid
            LEFT JOIN empresa e ON e.ruc = c.clienteid
            INNER JOIN lectura l ON l.acometidaid = ac.acometidaid
            INNER JOIN tarifa t on t.tarifaid = ac.tarifaid
            LEFT JOIN consumo_promedio cp ON cp.acometidaid = ac.acometidaid
            WHERE ac.acometidaid = $1 AND l.fechalectura IS NOT NULL
            ORDER BY l.fechalectura  DESC LIMIT 2;
      `
      const params: string[] = [cadastralKey];

      const result = await this.postgresqlService.query<ReadingBasicInfoSQLResult>(query, params);
      const response: ReadingBasicInfoResponse[] = result.map((value) => ReadingPostgreSQLAdapter.fromReadingPostgreSQLResultToReadingBasicInfoResponse(value));
      return response
    } catch (error) {
      throw error
    }
  }

  async findReadingInfo(cadastralKey: string): Promise<ReadingInfoResponse[]> {
    try {

      const query: string = `
        WITH ultima_lectura_valida AS (
          -- 1. Obtener SOLO las últimas 5 lecturas válidas (por fecha)
          SELECT
            l.lecturaid,
            l.acometidaid,
            l.fechalectura,
            l.horalectura,
            l.lecturaanterior,
            l.lecturaactual,
            l.valorlectura
          FROM (
            SELECT l.*
            FROM lectura l
            WHERE l.acometidaid = $1
              AND l.fechalectura IS NOT NULL
              AND l.novedad IS NOT NULL
              AND l.novedad NOT LIKE '%INICIAL AUTOMÁTICA%'
              AND l.novedad NOT LIKE '%CAMBIO MEDIDOR%'
            ORDER BY l.fechalectura DESC
            LIMIT 5
          ) l
          ORDER BY l.fechalectura DESC  -- Re-ordenar para ROW_NUMBER()
        ),

        ranked AS (
          SELECT
            *,
            ROW_NUMBER() OVER (PARTITION BY acometidaid ORDER BY fechalectura DESC) AS rn
          FROM ultima_lectura_valida
        ),

        periodo AS (
          SELECT
            COALESCE(sl.fechaInicioPeriodo, CURRENT_DATE - INTERVAL '1 month') AS inicio,
            sl.fechaSiguienteLectura AS fecha_mitad,
            COALESCE(sl.fechaFinPeriodo, CURRENT_DATE + INTERVAL '1 month') AS fin
          FROM SiguienteLectura sl
          WHERE sl.acometidaId = $1
        ),

        lectura_en_periodo AS (
          SELECT
            (CURRENT_DATE BETWEEN p.inicio AND p.fin) AS en_periodo,
            EXISTS (
              SELECT 1
              FROM lectura l2
              WHERE l2.acometidaid = $1
                AND l2.fechalectura::date BETWEEN p.inicio AND p.fin
                AND l2.novedad NOT LIKE '%INICIAL AUTOMÁTICA%'
                AND l2.novedad NOT LIKE '%CAMBIO MEDIDOR%'
            ) AS ya_tomada
          FROM periodo p
        )

        -- Consulta final
        SELECT
          l.lecturaid AS "readingId",
          l.fechalectura AS "previousReadingDate",
          l.horalectura AS "readingTime",
          ac.acometidaid AS "cadastralKey",
          c.clienteid AS "cardId",
          COALESCE(ci.nombres || ' ' || ci.apellidos, e.razonsocial) AS "clientName",
          cc.phones AS "clientPhones",
          cc.emails AS "clientEmails",
          ac.direccion AS address,
          l.lecturaanterior AS "previousReading",
          l.lecturaactual AS "currentReading",
          l.valorlectura AS "readingValue",
          ac.sector,
          ac.cuenta AS account,
          cp.average_consumption AS "averageConsumption",
          ac.numeromedidor AS "meterNumber",
          ac.tarifaid AS "rateId",
          t.nombre AS "rateName",

          (l.rn = 1 AND lep.en_periodo AND NOT lep.ya_tomada) AS "hasCurrentReading",

          lep.en_periodo AS "enPeriodoDebug",
          lep.ya_tomada AS "yaTomadaDebug"

        FROM ranked l
        CROSS JOIN periodo p
        CROSS JOIN lectura_en_periodo lep
        JOIN acometida ac ON ac.acometidaid = l.acometidaid
        LEFT JOIN cliente c ON c.clienteid = ac.clienteid
        LEFT JOIN ciudadano ci ON ci.ciudadanoid = c.clienteid
        LEFT JOIN empresa e ON e.ruc = c.clienteid
        INNER JOIN tarifa t ON t.tarifaid = ac.tarifaid
        LEFT JOIN consumo_promedio cp ON cp.acometidaid = ac.acometidaid
        LEFT JOIN cliente_contacto cc ON cc.clienteid = c.clienteid

        WHERE l.rn <= 2
        ORDER BY l.fechalectura DESC;
      `;

      const params: string[] = [cadastralKey];

      const result = await this.postgresqlService.query<ReadingInfoResponse>(query, params);
      const response: ReadingInfoResponse[] = result.map((value) => ReadingPostgreSQLAdapter.fromReadingPostgreSQLResultToReadingInfoResponse(value));

      if (response.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `No readings found for cadastral key: ${cadastralKey}`,
        });
      }

      return response

    } catch (error) {
      throw error
    }
  }


  async verifyReadingIfExist(readingId: number): Promise<boolean> {
    try {
      const query: string = `SELECT EXISTS (SELECT 1 FROM lectura l WHERE l.lecturaid = $1)`;
      const params: number[] = [readingId]
      const result = await this.postgresqlService.query<boolean>(query, params);
      return result[0]
    } catch (error) {
      throw error
    }
  }

  async updateCurrentReading(readingId: number, readingModel: ReadingModel): Promise<ReadingResponse | null> {
    try {

      const query: string = `
      UPDATE lectura
      SET
          fechalectura = DATE 'now',
          horalectura = TO_CHAR(NOW()::TIME, 'HH24:MI:SS'),
          valorlectura = $1,
          tasaalcantarillado = $2,
          lecturaactual = $3,
          codigoingresorenta = $4,
          novedad = $5,
          codigoingreso = $6
      WHERE lecturaid = $7
      RETURNING
        lecturaid as "readingId",
        acometidaid as "connectionId",
        fechalectura as "readingDate",
        horalectura as "readingTime",
        sector as "sector",
        cuenta as "account",
        clavecatastral as "cadastralKey",
        valorlectura as "readingValue",
        tasaalcantarillado as "sewerRate",
        lecturaanterior as "previewsReading",
        lecturaactual as "currentReading",
        codigoingresorenta as "rentalIncomeCode",
        novedad as "novelty",
        codigoingreso as "incomeCode";
      `;

      const params = [
        readingModel.getReadingValue() ?? 0,
        readingModel.getSewerRate() ?? 0,
        readingModel.getCurrentReading() ?? 0,
        readingModel.getRentalIncomeCode() ?? 0,
        readingModel.getNovelty() ?? 'NO NOVELTY',
        readingModel.getIncomeCode() ?? 0,
        readingId
      ];

      const result = await this.postgresqlService.query<ReadingSQLResult>(query, params);
      if (result.length === 0) {
        return null
      }
      return ReadingPostgreSQLAdapter.fromReadingPostgreSQLResultToReadingResponse(result[0]);

    } catch (error) {
      throw error
    }
  }

  async createReading(readingModel: ReadingModel): Promise<ReadingResponse | null> {
    try {
      const acometidaId = readingModel.getConnectionId();

      // === TRANSACCIÓN CON CONTROL AVANZADO DE DUPLICADOS ===
      const result = await this.postgresqlService.transaction(async (client) => {
        // === 1. Obtener IDs de estados ===
        const pendQuery = `SELECT lecturaEstadoId FROM LecturaEstado WHERE codigo = 'PEND' LIMIT 1;`;
        const fuerQuery = `SELECT lecturaEstadoId FROM LecturaEstado WHERE codigo = 'FUER' LIMIT 1;`;

        const [pendResult, fuerResult] = await Promise.all([
          client.query(pendQuery),
          client.query(fuerQuery),
        ]);

        const pendId = pendResult.rowCount > 0 ? pendResult.rows[0].lecturaestadoid : null;
        const fuerId = fuerResult.rowCount > 0 ? fuerResult.rows[0].lecturaestadoid : null;

        if (!pendId || !fuerId) {
          throw new RpcException({
            statusCode: statusCode.INTERNAL_SERVER_ERROR,
            message: `Estados PEND o FUER no encontrados en LecturaEstado.`,
          });
        }

        // === 2. CONTROL AVANZADO: REGLAS DE DUPLICADOS ===
        const fechaLecturaInput = readingModel.getReadingDate() ?? new Date();
        const mesLectura = fechaLecturaInput.toISOString().slice(0, 7);  // '2025-11'
        const novedadInput = readingModel.getNovelty() ?? 'LECTURA NORMAL';

        const isEspecial = novedadInput.includes('INICIAL') || novedadInput.includes('CAMBIO DE MEDIDOR');

        // Conteo con filtro
        const countQuery = `
        SELECT 
          COUNT(*) FILTER (WHERE novedad NOT LIKE '%INICIAL%' AND novedad NOT LIKE '%CAMBIO DE MEDIDOR%') AS normales,
          COUNT(*) FILTER (WHERE novedad LIKE '%INICIAL%' OR novedad LIKE '%CAMBIO DE MEDIDOR%') AS especiales
        FROM Lectura
        WHERE acometidaId = $1
          AND TO_CHAR(fechaLectura, 'YYYY-MM') = $2
          AND lecturaEstadoId IS NOT NULL;
      `;
        const countResult = await client.query(countQuery, [acometidaId, mesLectura]);
        const normales = parseInt(countResult.rows[0].normales || '0', 10);
        const especiales = parseInt(countResult.rows[0].especiales || '0', 10);

        const maxNormal = 1;
        const maxEspecial = 2;

        if (!isEspecial && normales >= maxNormal) {
          throw new RpcException({
            statusCode: statusCode.CONFLICT,
            message: `Ya existe una lectura normal en ${mesLectura}. Máximo ${maxNormal} permitida.`,
          });
        }

        if (isEspecial && especiales >= maxEspecial) {
          throw new RpcException({
            statusCode: statusCode.CONFLICT,
            message: `Máximo ${maxEspecial} lecturas especiales (INICIAL/CAMBIO MEDIDOR) en ${mesLectura}.`,
          });
        }

        // === 3. Verificar rango de período ===
        const nextQuery = `
        SELECT fechaInicioPeriodo, fechaFinPeriodo
        FROM SiguienteLectura
        WHERE acometidaId = $1;
      `;
        const nextResult = await client.query(nextQuery, [acometidaId]);

        let estadoId = pendId;
        let novedadFinal = novedadInput || 'LECTURA NORMAL (dentro de período)';

        const hoy = new Date(fechaLecturaInput);
        hoy.setHours(0, 0, 0, 0);

        if (nextResult.rowCount > 0) {
          const { fechainicioperiodo: inicio, fechafinperiodo: fin } = nextResult.rows[0];
          const inicioDate = new Date(inicio);
          const finDate = new Date(fin);

          const dentro = hoy >= inicioDate && hoy <= finDate;

          if (!dentro) {
            estadoId = fuerId;
            novedadFinal = novedadInput || 'LECTURA FUERA DE PERIODO';
          }
        } else {
          estadoId = fuerId;
          novedadFinal = novedadInput || 'LECTURA SIN PERIODO DEFINIDO';
        }

        // === 4. INSERT Lectura con estado y novedad correctos ===
        const insertQuery = `
        INSERT INTO lectura(
          acometidaid, fechalectura, horalectura, sector, cuenta, clavecatastral,
          valorlectura, tasaalcantarillado, lecturaanterior, lecturaactual,
          codigoingresorenta, novedad, codigoingreso, tiponovedadlecturaid, lecturaestadoid
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING
          lecturaid as "readingId",
          acometidaid as "connectionId",
          fechalectura as "readingDate",
          horalectura as "readingTime",
          sector as "sector",
          cuenta as "account",
          clavecatastral as "cadastralKey",
          valorlectura as "readingValue",
          tasaalcantarillado as "sewerRate",
          lecturaanterior as "previousReading",
          lecturaactual as "currentReading",
          codigoingresorenta as "rentalIncomeCode",
          novedad as "novelty",
          codigoingreso as "incomeCode",
          (SELECT codigo FROM LecturaEstado WHERE lecturaEstadoId = $15) as "statusCode";
      `;

        const params: (string | Date | number | null)[] = [
          acometidaId,
          fechaLecturaInput,
          readingModel.getReadingTime() ?? new Date(),
          readingModel.getSector(),
          readingModel.getAccount(),
          readingModel.getCadastralKey(),
          readingModel.getReadingValue() ?? 0,
          readingModel.getSewerRate() ?? 0,
          readingModel.getPreviousReading() ?? 0,
          readingModel.getCurrentReading() ?? 0,
          readingModel.getRentalIncomeCode() ?? null,
          novedadFinal,
          readingModel.getIncomeCode() ?? null,
          readingModel.getTipoNovedadLecturaId() ?? 1,
          estadoId
        ];

        const insertResult = await client.query<ReadingSQLResult>(insertQuery, params);

        if (insertResult.rowCount === 0) {
          throw new RpcException({
            statusCode: statusCode.INTERNAL_SERVER_ERROR,
            message: `Failed to create reading.`,
          });
        }

        return insertResult.rows[0];
      });

      // === RESPUESTA ENRIQUECIDA ===
      const response = ReadingPostgreSQLAdapter.fromReadingPostgreSQLResultToReadingResponse(result);

      return response;

    } catch (error) {
      throw error;
    }
  }
}