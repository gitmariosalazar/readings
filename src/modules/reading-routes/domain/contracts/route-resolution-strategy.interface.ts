export interface RouteResolutionContext {
  longitud: number;
  latitud: number;
  sectorId?: number;
  acometidaId?: string;
}

export interface RouteResolutionResult {
  idRuta: number;
  codigo: string;
  nombre: string;
  sectorId: number;
  metodoResolucion: string;
  distanciaMetros: number;
}

export interface IRouteResolutionStrategy {
  name: string;
  priority: number;
  resolve(context: RouteResolutionContext): Promise<RouteResolutionResult | null>;
}
