/*
export interface CalculateReadingValueResponse {
  cadastralKey: string;
  consumption: number;
  waterConsumptionValue: number; // o subtotalValue
  baseRate: number;              // o baseTariff
  rateName: string;              // o tariffName
  sewerageValue: number;         // o sewageValue
  others: number;
  additionalCost: number;
  total: number;
}
*/

export interface CalculationWaterBreakdown {
  categoryId: number;
  tariffName: string | null;
  minRange: number;
  maxRange: number;
  appliedBase: number;
  additionalRatePerM3: number;
  additionalM3: number;
  waterAmount: number;
  formula: string;
  tariffStructureVersion: string | null;
}

export interface CalculationConceptBreakdown {
  conceptId: number;
  amount: number;
  calculationBase: number | null;
  formula: string | null;
  validityConceptId?: number;
  versionSheet?: string | null;
}

export interface CalculationBreakdown {
  water: CalculationWaterBreakdown;
  concepts: CalculationConceptBreakdown[];
}

export class CalculateReadingValueModel {
  public cadastralKey: string;
  public consumption: number;
  public waterConsumptionValue: number; // o subtotalValue
  public baseRate: number; // o baseTariff
  public rateName: string; // o tariffName
  public sewerageValue: number; // o sewageValue
  public others: number;
  public additionalCost: number;
  public fixedRatePerM3: number;
  public total: number;
  // Solo informativo para trazabilidad; no forma parte de la respuesta pública.
  public breakdown?: CalculationBreakdown;

  constructor(data: {
    cadastralKey: string;
    consumption: number;
    waterConsumptionValue: number;
    baseRate: number;
    rateName: string;
    sewerageValue: number;
    others: number;
    additionalCost: number;
    fixedRatePerM3: number;
    total: number;
    breakdown?: CalculationBreakdown;
  }) {
    this.cadastralKey = data.cadastralKey;
    this.consumption = data.consumption;
    this.waterConsumptionValue = data.waterConsumptionValue;
    this.baseRate = data.baseRate;
    this.rateName = data.rateName;
    this.sewerageValue = data.sewerageValue;
    this.others = data.others;
    this.additionalCost = data.additionalCost;
    this.fixedRatePerM3 = data.fixedRatePerM3;
    this.total = data.total;
    this.breakdown = data.breakdown;
  }
}

export class ReadingConceptDetailModel {
  constructor(
    public readonly id: string | null,
    public readonly readingId: number,
    public readonly conceptId: number,
    public readonly amount: number,
    public readonly calculationBase: number | null,
    public readonly formula: string | null,
    public readonly createdAt?: Date,
  ) {}
}

export class ReadingWaterCalculationModel {
  constructor(
    public readonly id: string | null,
    public readonly readingId: number,
    public readonly categoryId: number,
    public readonly tariffName: string | null,
    public readonly minRange: number | null,
    public readonly maxRange: number | null,
    public readonly appliedBase: number | null,
    public readonly additionalRatePerM3: number | null,
    public readonly additionalM3: number | null,
    public readonly waterAmount: number,
    public readonly formula: string | null,
    public readonly tariffStructureVersion: string | null,
    public readonly createdAt?: Date,
  ) {}
}

/*
      SELECT cat.categoria_id AS "categoryId", cat.nombre AS "categoryName" FROM acometida a
        INNER JOIN tarifa t
        ON a.tarifa_id = t.tarifa_id
        INNER JOIN categoria cat ON cat.categoria_id = t.categoria_id
        WHERE acometida_id = $1;
    `;
*/

export class RateConnectionModel {
  constructor(
    public readonly categoryId: number,
    public readonly categoryName: string,
  ) {}
}

/*
      SELECT
          minimo AS "Minimo",
          maximo AS "Maximo",
          base AS "Base",
          adicional AS "Adicional"
      FROM valor_tarifa
      WHERE id_categoria = $1
      ORDER BY minimo ASC;
*/

export class RateRangeModel {
  public readonly versionSheet?: string | null;
  public readonly min: number;
  public readonly max: number;
  public readonly base: number;
  public readonly additional: number;

  constructor(
    min: number,
    max: number,
    base: number,
    additional: number,
    versionSheet?: string | null,
  );
  constructor(
    versionSheet: string,
    min: number,
    max: number,
    base: number,
    additional: number,
  );
  constructor(
    arg1: string | number,
    arg2: number,
    arg3: number,
    arg4: number,
    arg5?: string | number | null,
  ) {
    if (typeof arg1 === 'string') {
      this.versionSheet = arg1;
      this.min = arg2;
      this.max = arg3;
      this.base = arg4;
      this.additional = typeof arg5 === 'number' ? arg5 : 0;
    } else {
      this.min = arg1;
      this.max = arg2;
      this.base = arg3;
      this.additional = arg4;
      this.versionSheet =
        typeof arg5 === 'string' ? arg5 : arg5 === null ? null : undefined;
    }
  }
}
