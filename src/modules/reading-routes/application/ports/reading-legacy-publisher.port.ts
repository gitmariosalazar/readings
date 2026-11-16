// readings/src/modules/reading-routes/application/ports/reading-legacy-publisher.port.ts

export const READING_LEGACY_PUBLISHER_PORT = Symbol(
  'READING_LEGACY_PUBLISHER_PORT',
);

export interface ReadingCreatedLegacyEvent {
  sector: number;
  account: number;
  year: number;
  month: string; // Nombre del mes en español (ej. 'NOVIEMBRE')
  previousReading: number;
  currentReading: number;
  readingDate: string | Date;
  readingTime: string;
  novelty: string;
  meterStatus: string | null;
  username: string;
  userCardId: string;
  readingId?: string | number;
  cadastralKey?: string;
}

export interface IReadingLegacyPublisherPort {
  publishReadingCreated(event: ReadingCreatedLegacyEvent): Promise<void>;
  publishBatchReadingsCreated(
    events: ReadingCreatedLegacyEvent[],
  ): Promise<void>;
}
