import { DatabaseServicePostgreSQL } from 'src/shared/connections/database/postgresql/postgresql.service';
import { InterfaceReadingRepository } from './../../../../domain/contracts/reading.interface.repository';
import { Injectable } from "@nestjs/common";
import { ReadingBasicInfoResponse } from 'src/modules/reading/domain/schemas/dto/response/reading-basic.response';
import { ReadingBasicInfoSQLResult, ReadingSQLResult } from '../../../interfaces/sql/reading-sql.result.interface';
import { ReadingPostgreSQLAdapter } from '../adapters/reading-postgresql.adapter';
import { ReadingResponse } from 'src/modules/reading/domain/schemas/dto/response/reading.response';
import { ReadingModel } from 'src/modules/reading/domain/schemas/model/reading.model';

@Injectable()
export class ReadingPersistencePostgreSQL implements InterfaceReadingRepository {
  constructor(
    private readonly postgresqlService: DatabaseServicePostgreSQL
  ) { }

  async findReadingBasicInfo(catastralCode: string): Promise<ReadingBasicInfoResponse[]> {
    try {
      const query: string = `
        SELECT
          l.lecturaid AS "readingId",
          l.fechalectura AS "previousReadingDate",
          ac.acometidaid AS "catastralCode",
          c.clienteid AS "cardId",
          COALESCE(ci.nombres || ' ' || ci.apellidos, e.razonsocial) AS "clientName",
          ac.direccion AS address,
          l.lecturaanterior AS "previousReading",
          l.lecturaactual AS "currentReading",
          ac.sector,
          ac.cuenta AS account,
          l.valorlectura as "readingValue",
          cp.average_consumption AS "averageConsumption"
        FROM acometida ac
        LEFT JOIN cliente c ON ac.clienteid = c.clienteid
        LEFT JOIN ciudadano ci ON ci.ciudadanoid = c.clienteid
        LEFT JOIN empresa e ON e.ruc = c.clienteid
        INNER JOIN lectura l ON l.acometidaid = ac.acometidaid
        LEFT JOIN consumo_promedio cp ON cp.acometidaid = ac.acometidaid
        WHERE ac.acometidaid = $1 AND l.fechalectura IS NOT NULL
        ORDER BY l.fechalectura  DESC
        LIMIT 2;
      `
      const params: string[] = [catastralCode];

      const result = await this.postgresqlService.query<ReadingBasicInfoSQLResult>(query, params);
      const response: ReadingBasicInfoResponse[] = result.map((value) => ReadingPostgreSQLAdapter.fromReadingPostgreSQLResultToReadingBasicInfoResponse(value));
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
      //console.log(`[Persistence] Creating reading for account: `, readingModel);
      const query: string = `
        INSERT INTO lectura(acometidaid,fechalectura,horalectura,sector,cuenta,clavecatastral,valorlectura,tasaalcantarillado,lecturaanterior,lecturaactual,codigoingresorenta,novedad,codigoingreso,tiponovedadlecturaid) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING
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
        codigoingreso as "incomeCode"
      `
      const params: (string | Date | number)[] = [
        readingModel.getConnectionId(),
        readingModel.getReadingDate() ?? new Date(),
        readingModel.getReadingTime() ?? new Date().getTime().toLocaleString(),
        readingModel.getSector(),
        readingModel.getAccount(),
        readingModel.getCadastralKey(),
        readingModel.getReadingValue() ?? 0,
        readingModel.getSewerRate() ?? 0,
        readingModel.getPreviousReading() ?? 0,
        readingModel.getCurrentReading() ?? 0,
        readingModel.getRentalIncomeCode() ?? 0,
        readingModel.getNovelty() ?? 'NORMAL',
        readingModel.getIncomeCode() ?? 0,
        readingModel.getTipoNovedadLecturaId() ?? 1
      ]
      const result = await this.postgresqlService.query<ReadingSQLResult>(query, params);
      if (result.length === 0) {
        return null
      }
      return ReadingPostgreSQLAdapter.fromReadingPostgreSQLResultToReadingResponse(result[0]);
    } catch (error) {
      throw error
    }
  }
}