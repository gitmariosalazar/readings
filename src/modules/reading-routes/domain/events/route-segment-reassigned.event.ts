export class RouteSegmentReassignedEvent {
  constructor(
    public readonly asignacionOrigenId: number,
    public readonly nuevaAsignacionId: number,
    public readonly nuevoUsuarioId: string,
    public readonly cantidadPredios: number,
    public readonly motivo: string,
    public readonly timestamp: Date = new Date(),
  ) {}
}
