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

export class ReadingConceptDetailRequest {
  readingId!: number;
  conceptId!: number;
  amount!: number;
  calculationBase!: number | null;
  formula!: string | null;
  versionSheet?: string | null;
  validityConceptId?: number;
}

export class ReadingWaterCalculationRequest {
  readingId!: number;
  categoryId!: number;
  tariffName!: string | null;
  minRange!: number | null;
  maxRange!: number | null;
  appliedBase!: number | null;
  additionalRatePerM3!: number | null;
  additionalM3!: number | null;
  waterAmount!: number;
  formula!: string | null;
  tariffStructureVersion!: string | null;
  versionSheet?: string | null;
}
