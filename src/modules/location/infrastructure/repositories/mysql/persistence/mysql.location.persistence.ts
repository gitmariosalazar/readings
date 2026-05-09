import { Injectable } from '@nestjs/common';
import { LocationSqlResult } from '../../../interfaces/sql/location.sql.result';
import { LocationAdapter } from '../../../adapters/location.sql.adapter';
import { InterfaceLocationRepository } from '../../../../domain/contracts/location.interface.repository';
import { DatabaseAbstract } from '../../../../../../shared/connections/database/abstract/abstract.database';
import { LocationModel } from '../../../../domain/schemas/model/location.model';

@Injectable()
export class LocationPersistenceMySQL implements InterfaceLocationRepository {
  constructor(private readonly databaseService: DatabaseAbstract) {}

  async verifyLocationByConnectionIdExists(
    connectionId: string,
  ): Promise<boolean> {
    const query = `
      SELECT EXISTS (
        SELECT 1
        FROM Ubicacion
        WHERE acometidaId = ?
      ) AS "exists";
    `;

    const result = await this.databaseService.query<{ exists: number }>(query, [
      connectionId,
    ]);
    return result[0]?.exists === 1;
  }

  async getLocationById(locationId: number): Promise<LocationModel | null> {
    const query = `
      SELECT
        u.ubicacionId AS "locationId",
        u.acometidaId AS "connectionId",
        ST_AsText(u.coordenadas) AS "coordinates",
        u.metadata AS "metadata",
        u.fechaRegistro AS "createdAt"
        FROM Ubicacion u
      WHERE u.ubicacionId = ?;
    `;

    const result = await this.databaseService.query<LocationSqlResult>(query, [
      locationId,
    ]);

    if (result.length === 0) return null;

    return LocationAdapter.fromLocationSqlResultToLocationModel(result[0]);
  }

  async getLocationsByConnectionId(
    connectionId: string,
  ): Promise<LocationModel[]> {
    const query = `
      SELECT
        u.ubicacionId AS "locationId",
        u.acometidaId AS "connectionId",
        ST_AsText(u.coordenadas) AS "coordinates",
        u.metadata AS "metadata",
        u.fechaRegistro AS "createdAt"
      FROM Ubicacion u
      WHERE u.acometidaId = ?;
    `;

    const result = await this.databaseService.query<LocationSqlResult>(query, [connectionId]);
    return result.map((r) => LocationAdapter.fromLocationSqlResultToLocationModel(r));
  }

  async createLocation(location: LocationModel): Promise<LocationModel | null> {
    const query = `
      INSERT INTO Ubicacion (coordenadas, metadata, acometidaId)
        VALUES (ST_GeomFromText(?, 4326), ?, ?);
    `;

    const values = [
      location.getCoordinates(),
      location.getMetadata(),
      location.getConnectionId(),
    ];

    const { insertId } = await this.databaseService.execute(query, values);
    
    const selectResult = await this.databaseService.query<LocationSqlResult>(
      `SELECT ubicacionId AS "locationId", acometidaId AS "connectionId", ST_AsText(coordenadas) AS "coordinates", metadata AS "metadata", fechaRegistro AS "createdAt" FROM Ubicacion WHERE ubicacionId = ?`, 
      [insertId]
    );

    if (selectResult.length === 0) return null;

    return LocationAdapter.fromLocationSqlResultToLocationModel(selectResult[0]);
  }
}
