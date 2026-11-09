export class TopConsumersFilterRequest {
  month!: string;
  sector?: number;
  limit?: number;
  minConsumptionM3?: number;
  novelty?: string;
}
