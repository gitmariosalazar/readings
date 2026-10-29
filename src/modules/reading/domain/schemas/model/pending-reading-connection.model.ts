import { ReadingHistoryModel } from './reading-history.model';

export class PendingReadingConnectionModel {
  constructor(
    public readonly cadastralKey: string,
    public readonly meterNumber: string,
    public readonly address: string,
    public readonly sector: number,
    public readonly account: number,
    public readonly clientName: string,
    public readonly cardId: string,
    public readonly rateName: string,
    public readonly averageConsumption?: number,
    public readonly locationConnection?: { lat: number; lng: number } | null,
    public readonly lastReading?: ReadingHistoryModel | null,
    public readonly distanceMeters?: number | null,
  ) {}
}
