import { ReadingRouteEntity } from '../entities/reading-route.entity';
import { RouteConnectionModel } from '../entities/route-connection.entity';
import { RouteResolutionResult } from './route-resolution-strategy.interface';

export const READING_ROUTE_REPOSITORY = 'ReadingRouteRepository';

export interface RouteFilterParams {
  sectorId?: number;
  activa?: boolean;
  estado?: string;
  periodo?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface InsertConnectionParams {
  idRuta: number;
  acometidaId: string;
  ordenSugerido?: number;
  ladoCalle?: string;
  instruccionAcceso?: string;
}

export interface OptimizeSequenceResult {
  totalReordenadas: number;
  distanciaTotalCaminadaMetros: number;
}

export interface RouteGeoJsonFilter {
  sectorId?: number;
  activa?: boolean;
  activaOnly?: boolean;
  estado?: string;
  periodo?: string;
}

export interface IReadingRouteRepository {
  findAll(
    filter?: RouteFilterParams,
  ): Promise<{ items: ReadingRouteEntity[]; total: number }>;
  findById(id: number): Promise<ReadingRouteEntity | null>;
  getRoutesGeoJson(filter?: RouteGeoJsonFilter): Promise<any>;
  getCentroidsGeoJson(filter?: boolean | RouteGeoJsonFilter): Promise<any>;
  getRouteConnections(idRuta: number): Promise<RouteConnectionModel[]>;
  resolveRouteByCoordinates(
    longitud: number,
    latitud: number,
    sectorId?: number,
  ): Promise<RouteResolutionResult | null>;
  getNextSequenceNumber(idRuta: number): Promise<number>;
  insertConnection(params: InsertConnectionParams): Promise<void>;
  optimizeRouteSequence(
    idRuta: number,
    acometidaInicio?: string,
  ): Promise<OptimizeSequenceResult>;
}
