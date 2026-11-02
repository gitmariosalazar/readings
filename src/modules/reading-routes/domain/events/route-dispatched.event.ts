export class RouteDispatchedEvent {
  constructor(
    public readonly asignacionId: number,
    public readonly rutaId: number,
    public readonly codigoRuta: string,
    public readonly lecturistaId: string,
    public readonly periodo: string,
    public readonly totalPredios: number,
    public readonly timestamp: Date = new Date(),
  ) {}
}
