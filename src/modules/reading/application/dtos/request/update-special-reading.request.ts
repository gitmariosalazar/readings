export class UpdateSpecialReadingRequest {
  readingId!: number;
  tipoAjusteId!: number;
  justificacion!: string;
  previousReading!: number | null;
  currentReading!: number | null;
  readingValue!: number | null;
  sewerRate!: number | null;
  novelty!: string | null;
  typeNoveltyReadingId!: number | null;
  cadastralKey!: string;
  averageConsumption!: number;
}
