export interface RouteDispatchPolicyConfig {
  /** Límite máximo diario de rutas que puede tener asignadas un lecturista (5 rutas). */
  readonly maxDailyRoutesPerOperator: number;
  /** Umbral en el que se considera carga alta (4 rutas). */
  readonly highLoadThresholdRoutesPerOperator: number;
}

export const DEFAULT_ROUTE_DISPATCH_POLICY_CONFIG: RouteDispatchPolicyConfig = {
  maxDailyRoutesPerOperator: 5,
  highLoadThresholdRoutesPerOperator: 4,
};

export class RouteDispatchPolicy {
  private readonly config: RouteDispatchPolicyConfig;

  constructor(
    config: RouteDispatchPolicyConfig = DEFAULT_ROUTE_DISPATCH_POLICY_CONFIG,
  ) {
    this.config = Object.freeze({ ...config });
  }

  public get maxDailyRoutes(): number {
    return this.config.maxDailyRoutesPerOperator;
  }

  public get highLoadThreshold(): number {
    return this.config.highLoadThresholdRoutesPerOperator;
  }

  /** Determina si el lecturista alcanzó el tope (ej. 4/4) */
  public hasReachedMaxLimit(currentCount: number): boolean {
    return currentCount >= this.config.maxDailyRoutesPerOperator;
  }

  /** Valida si es posible sumar `additionalCount` rutas sin violar la regla */
  public canAssign(currentCount: number, additionalCount: number = 1): boolean {
    return (
      currentCount + additionalCount <= this.config.maxDailyRoutesPerOperator
    );
  }

  /** Cupo remanente disponible */
  public getRemainingCapacity(currentCount: number): number {
    return Math.max(0, this.config.maxDailyRoutesPerOperator - currentCount);
  }

  /** Nivel de carga para badges y estilos: IDLE | NORMAL | HIGH | MAX_REACHED */
  public getWorkloadLevel(
    currentCount: number,
  ): 'IDLE' | 'NORMAL' | 'HIGH' | 'MAX_REACHED' {
    if (currentCount >= this.config.maxDailyRoutesPerOperator)
      return 'MAX_REACHED';
    if (currentCount >= this.config.highLoadThresholdRoutesPerOperator)
      return 'HIGH';
    if (currentCount > 0) return 'NORMAL';
    return 'IDLE';
  }

  /** Mensaje de validación amigable */
  public getLimitExceededMessage(operatorName?: string): string {
    const nameStr = operatorName
      ? `El lecturista ${operatorName}`
      : 'El lecturista';
    return `${nameStr} ya cuenta con el límite máximo diario permitido de ${this.config.maxDailyRoutesPerOperator} rutas activas.`;
  }

  public static defaults(): RouteDispatchPolicy {
    return new RouteDispatchPolicy(DEFAULT_ROUTE_DISPATCH_POLICY_CONFIG);
  }
}

export const defaultRouteDispatchPolicy = RouteDispatchPolicy.defaults();
