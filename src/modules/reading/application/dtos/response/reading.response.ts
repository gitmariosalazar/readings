import { PhotoReadingResponse } from '../../../../images-readings/application/dtos/response/photo-reading.response';

export interface ReadingResponse {
  readingId: number;
  connectionId: string;
  readingDate: Date | null;
  readingTime: string | null;
  sector: number;
  account: number;
  cadastralKey: string;
  readingValue: number | null;
  sewerRate: number | null;
  previousReading: number | null;
  currentReading: number | null;
  rentalIncomeCode: number | null;
  novelty: string | null;
  incomeCode: number | null;
  locationCapture?: { lat: number; lng: number } | null;
  readingCode?: string;
  photos?: PhotoReadingResponse[];
  consumptionM3?: number;
  totalValue?: number;
}

export interface PendingReadingConnectionResponse {
  cadastralKey: string;
  meterNumber: string;
  address: string;
  sector: number;
  account: number;
  clientName: string;
  cardId: string;
  rateName: string;
  averageConsumption: number;
}

export interface TakenReadingConnectionResponse {
  readingId: string;
  readingDate: Date | null;
  cadastralKey: string;
  meterNumber: string;
  address: string;
  sector: number;
  account: number;
  clientName: string;
  cardId: string;
  previousReading: number;
  currentReading: number;
  readingValue: number;
  calculatedConsumption: number;
  averageConsumption: number;
  rateName: string;
  readingTypeId: number;
  readingTypeName: string;
  novelty?: string;
  locationCapture?: { lat: number; lng: number } | null;
  locationConnection?: { lat: number; lng: number } | null;
  distanceMeters?: number | null;
  isInsideAllowedRadius?: boolean | null;
  distanceLineGeoJSON?: any | null;
  readingCode?: string | null;
  userCreatedId?: string | null;
  userCreatedName?: string | null;
  userUpdatedId?: string | null;
  userUpdatedName?: string | null;
  updatedStatus: boolean;
  updaterUpdateDate?: Date | null;
}

export interface MonthlySummaryResponse {
  month: string;
  totalReadings: number;
  totalConsumption: number;
  averageConsumption: number;
  maxConsumption: number;
  minConsumption: number;
  incidentCount: number;
  incidentRatePercentage: number;
}

export interface ReadingNoveltyResponse {
  readingId: number;
  readingDate: Date | null;
  readingMonth: string;
  readingTime: string | null;
  cadastralKey: string;
  meterNumber: string;
  address: string;
  sector: number;
  account: number;
  clientName: string;
  cardId: string;
  previousReading: number;
  currentReading: number | null;
  readingValue: number | null;
  calculatedConsumption: number | null;
  averageConsumption: number | null;
  rateName: string;
  readingTypeId: number;
  readingTypeName: string;
  novelty: string;
  noveltyTypeId: number | null;
  noveltyTypeName: string | null;
  noveltyTypeDescription: string | null;
  images: string[];
  locationCapture?: { lat: number; lng: number } | null;
  locationConnection?: { lat: number; lng: number } | null;
  distanceMeters?: number | null;
  isInsideAllowedRadius?: boolean | null;
  distanceLineGeoJSON?: any | null;
  readingCode?: string | null;
  userCreatedId?: string | null;
  userCreatedName?: string | null;
  userUpdatedId?: string | null;
  userUpdatedName?: string | null;
}

export interface CalculateReadingValueResponse {
  cadastralKey: string;
  consumption: number;
  waterConsumptionValue: number; // o subtotalValue
  baseRate: number; // o baseTariff
  rateName: string; // o tariffName
  sewerageValue: number; // o sewageValue
  others: number;
  additionalCost: number;
  fixedRatePerM3: number;
  total: number;
}

export interface ReadingConceptDetailResponse {
  id: string | null;
  readingId: number;
  conceptId: number;
  conceptName?: string;
  conceptCode?: string;
  amount: number;
  calculationBase: number | null;
  formula: string | null;
  createdAt?: string;
}

export interface ReadingWaterCalculationResponse {
  id: string | null;
  readingId: number;
  categoryId: number;
  tariffName: string | null;
  minRange: number | null;
  maxRange: number | null;
  appliedBase: number | null;
  additionalRatePerM3: number | null;
  additionalM3: number | null;
  waterAmount: number;
  formula: string | null;
  tariffStructureVersion: string | null;
  createdAt?: string;
}

export interface RateConnectionResponse {
  categoryId: number;
  categoryName: string;
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

export interface RateRangeResponse {
  min: number;
  max: number;
  base: number;
  additional: number;
}
