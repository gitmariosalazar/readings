export class ResolveIncidentRequest {
  description!: string;
  repairCost!: number;
  chargeToUser!: boolean;
  images?: string[];
}
