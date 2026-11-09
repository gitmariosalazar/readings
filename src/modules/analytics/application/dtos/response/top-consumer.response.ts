export class TopConsumerResponse {
  readingId!: number;
  sector!: number;
  account!: number;
  cadastralKey!: string;
  connectionId!: string;
  meterNumber!: string;
  address!: string;
  clientName!: string;
  previousReading!: number;
  currentReading!: number;
  consumedVolumeM3!: number;
  waterBilledUsd!: number;
  sewerBilledUsd!: number;
  totalBilledUsd!: number;
  novelty!: string;
  readingDate!: string;
  gpsCoordinates!: string | null;
}
