import { Injectable } from "@nestjs/common";
import { InterfaceObservationReadingRepository } from "src/modules/observations/domain/contracts/observation-reading.interface.repository";
import { ObservationReadingResponse } from "src/modules/observations/domain/schemas/dto/response/observation-reading.response";
import { ObservationReadingModel } from "src/modules/observations/domain/schemas/model/observation-reading.model";
import { DatabaseServicePostgreSQL } from "src/shared/connections/database/postgresql/postgresql.service";
import { ObservationReadingSQLResponse, ObservationReadingSQLResult, ObservationSQLResult } from "../../../interfaces/observatio-reading.sql.response";
import { ObservationReadingSQLAdapter } from "../adapters/observation-reading.postgresql.adapter";
import { ObservationDetailsResponse } from "src/modules/observations/domain/schemas/dto/response/observation-dedtails.response";

@Injectable()
export class ObservationReadingPostgreSQLPersistence implements InterfaceObservationReadingRepository {
  constructor(
    private readonly postgresqlService: DatabaseServicePostgreSQL
  ) { }

  async getObservationDetailsByCadastralKey(cadastralKey: string): Promise<ObservationDetailsResponse[]> {
    try {
      const query: string = `
        SELECT
            o.tituloobservacion as "observationTitle",
            o.detalleobservacion as "observationDetail",
            ol.fecharegistro as "registrationDate",
            ol.lecturaid as "readingId",
            l.acometidaid as "connectionId",
            l.lecturaanterior as "previousReading",
            l.lecturaactual as "currentReading",
            l.sector as "sector",
            l.cuenta as "account",
            l.valorlectura as "readingValue",
            tnl.tiponovedadlecturaid as "noveltyReadingTypeId",
            tnl.nombre as "noveltyTypeName",
            tnl.descripcion as "noveltyTypeDescription",
            a.direccion as "address",
            a.observaciones as "observations",
            c.clienteid as "clientId",
            c2.nombres AS "citizenFirstName",
            c2.apellidos AS "citizenLastName",
            e.empresaid as "companyId",
            e.nombrecomercial as "commercialName",
            e.razonsocial as "socialReason"
        FROM Acometida a
        INNER JOIN Lectura l ON a.acometidaId = l.acometidaId
        INNER JOIN ObservacionLectura ol ON l.lecturaId = ol.lecturaId
        INNER JOIN Observacion o ON ol.observacionId = o.observacionId
        INNER JOIN TipoNovedadLectura tnl ON l.tipoNovedadLecturaId = tnl.tipoNovedadLecturaId
        INNER JOIN Cliente c ON a.clienteid = c.clienteid
        LEFT JOIN Ciudadano c2 ON c2.ciudadanoid = c.clienteid
        LEFT JOIN Empresa e ON e.clienteid = c.clienteid
        WHERE a.claveCatastral = $1
        ORDER BY l.fechalectura DESC;
      `;
      const params: string[] = [cadastralKey];

      const result = await this.postgresqlService.query<ObservationDetailsResponse>(query, params);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async createObservationReading(observation: ObservationReadingModel): Promise<ObservationReadingResponse> {
    try {
      const insertObservationQuery: string = `
        INSERT INTO observacion (tituloobservacion, detalleobservacion) VALUES ($1,$2) returning observacionid as
        "observationId", tituloobservacion as "observationTitle", detalleobservacion as "observationDetails";
      `;
      const insertObservationParams = [observation.getObservation().getObservationTitle(), observation.getObservation().getObservationDetails()];

      const result = await this.postgresqlService.query<ObservationSQLResult>(insertObservationQuery, insertObservationParams);
      console.log(`result`, result);
      const observationId: number = result[0].observationId;

      const insertObservationReadingQuery: string = `insert into observacionlectura (observacionid, lecturaid) values ($1, $2) returning observacionlecturaid as "observationReadingId", observacionid as "observationId", lecturaid as "readingId";`;
      const insertObservationReadingParams = [observationId, observation.getReadingId()];

      const resultObservationReading = await this.postgresqlService.query<ObservationReadingSQLResult>(insertObservationReadingQuery, insertObservationReadingParams);

      const observationReadingId: number = resultObservationReading[0].observationReadingId;

      const selectObservationReadingQuery: string = `
        SELECT 
          ol.observacionlecturaid AS "observationReadingId",
          ol.lecturaid AS "readingId",
          o.observacionid AS "observationId",
          o.tituloobservacion AS "observationTitle",
          o.detalleobservacion AS "observationDetails"
        FROM observacionlectura ol
        INNER JOIN observacion o ON ol.observacionid = o.observacionid
        WHERE ol.observacionlecturaid = $1;
      `;
      const selectObservationReadingParams = [observationReadingId];

      const resultSelect = await this.postgresqlService.query<ObservationReadingSQLResponse>(selectObservationReadingQuery, selectObservationReadingParams);

      return ObservationReadingSQLAdapter.toObservationReadingResponse(resultSelect[0]);
    } catch (error) {
      throw error;
    }
  }

  async getObservationsByReadingId(readingId: number): Promise<ObservationReadingResponse[]> {
    try {
      const query: string = `
        SELECT 
          ol.observacionlecturaid AS "observationReadingId",
          ol.lecturaid AS "readingId",
          o.observacionid AS "observationId",
          o.tituloobservacion AS "observationTitle",
          o.detalleobservacion AS "observationDetails"
        FROM observacionlectura ol
        INNER JOIN observacion o ON ol.observacionid = o.observacionid
        WHERE ol.lecturaid = $1;
      `;
      const params = [readingId];

      const result = await this.postgresqlService.query<ObservationReadingSQLResponse>(query, params);
      return result.map(ObservationReadingSQLAdapter.toObservationReadingResponse);
    } catch (error) {
      throw error;
    }
  }
}