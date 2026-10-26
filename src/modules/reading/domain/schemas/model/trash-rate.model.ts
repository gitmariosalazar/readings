export type TrashRateOrigin =
  | 'EMELNORTE_DISTRIBUCION'
  | 'TARIFA_NUEVA_ACOMETIDA'
  | 'TARIFA_REACTIVACION_ACOMETIDA'
  | 'TARIFA_SIN_EMELNORTE'
  | 'AJUSTE_MANUAL';

export type TrashRateBillingType = 'FIJO' | 'POR_RANGOS_CONSUMO';

/**
 * Modelo de Asignación Fija de Tasa de Basura por Acometida.
 * Vinculado primariamente a la acometida física (Predio/Catastro).
 * El nuevo propietario hereda este valor si cambia la titularidad.
 */
export class TrashRateAssignmentModel {
  constructor(
    public readonly connectionId: string,
    public readonly originClientId: string,
    public readonly assignedAmount: number,
    public readonly origin: TrashRateOrigin,
    public readonly versionSheet: string,
    public readonly id?: number,
    public readonly totalClientOrigin?: number | null,
    public readonly emelnorteQuantityOrigin?: number | null,
    public readonly totalActiveConnections?: number | null,
    public readonly hasCadastralMismatch: boolean = false,
    public readonly isPennyRemainder: boolean = false,
    public readonly isActive: boolean = true,
    public readonly startDate: Date = new Date(),
    public readonly endDate?: Date | null,
    public readonly observation?: string | null,
  ) {}
}

/**
 * Rango escalonado de consumo para categorías dinámicas (Residencial).
 */
export class TrashRateRangeModel {
  constructor(
    public readonly minRange: number,
    public readonly maxRange: number,
    public readonly value: number,
    public readonly id?: number,
    public readonly versionSheet?: string | null,
    public readonly startDate?: Date,
    public readonly endDate?: Date | null,
    public readonly isActive: boolean = true,
  ) {}
}

/**
 * Tarifa configurada para una categoría dentro de un pliego tarifario.
 */
export class TrashRateCategoryTariffModel {
  constructor(
    public readonly categoryId: number,
    public readonly categoryName: string,
    public readonly billingType: TrashRateBillingType,
    public readonly minimumValue: number = 1.0,
    public readonly fixedValue?: number | null,
    public readonly versionSheet?: string | null,
    public readonly ranges: TrashRateRangeModel[] = [],
    public readonly id?: number,
  ) {}
}

/**
 * Resultado individual de distribución de centavos para cada acometida.
 */
export interface EmelnorteDistributionItemModel {
  connectionId: string;
  clientId: string;
  assignedAmount: number;
  isPennyRemainder: boolean;
  hasCadastralMismatch: boolean;
  origin: TrashRateOrigin;
  versionSheet: string;
  totalClientOrigin: number;
  emelnorteQuantityOrigin: number | null;
  totalActiveConnections: number;
  observation: string;
}

/**
 * Datos históricos cargados desde EMELNORTE para un cliente.
 */
export interface EmelnorteCustomerDataModel {
  identification: string;
  septemberTotal: number | null;
  septemberQuantity: number | null;
  totalAmount?: number | null;
  totalQuantity?: number | null;
}
