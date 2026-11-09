export class TopConsumerModel {
  constructor(
    public readonly readingId: number,
    public readonly sector: number,
    public readonly account: number,
    public readonly cadastralKey: string,
    public readonly connectionId: string,
    public readonly meterNumber: string,
    public readonly address: string,
    public readonly clientName: string,
    public readonly previousReading: number,
    public readonly currentReading: number,
    public readonly consumedVolumeM3: number,
    public readonly waterBilledUsd: number,
    public readonly sewerBilledUsd: number,
    public readonly totalBilledUsd: number,
    public readonly novelty: string,
    public readonly readingDate: string,
    public readonly gpsCoordinates: string | null,
  ) {}
}
