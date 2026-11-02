export class ReadingsBatchSyncedEvent {
  constructor(
    public readonly asignacionId: number,
    public readonly totalSincronizados: number,
    public readonly lecturistaId: string,
    public readonly timestamp: Date = new Date(),
  ) {}
}
