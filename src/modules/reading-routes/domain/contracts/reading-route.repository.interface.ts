import { ReadingRouteEntity } from '../entities/reading-route.entity';
import { RouteResolutionResult } from './route-resolution-strategy.interface';

export const READING_ROUTE_REPOSITORY = 'ReadingRouteRepository';

export interface RouteFilterParams {
  sectorId?: number;
  activa?: boolean;
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

export interface IReadingRouteRepository {
  findAll(filter?: RouteFilterParams): Promise<{ items: ReadingRouteEntity[]; total: number }>;
  findById(id: number): Promise<ReadingRouteEntity | null>;
  getRoutesGeoJson(filter?: { sectorId?: number; activa?: boolean }): Promise<any>;
  getCentroidsGeoJson(activaOnly?: boolean): Promise<any>;
  getRouteConnections(idRuta: number): Promise<any[]>;
  resolveRouteByCoordinates(longitud: number, latitud: number, sectorId?: number): Promise<RouteResolutionResult | null>;
  getNextSequenceNumber(idRuta: number): Promise<number>;
  insertConnection(params: InsertConnectionParams): Promise<void>;
  optimizeRouteSequence(idRuta: number, acometidaInicio?: string): Promise<OptimizeSequenceResult>;
}
