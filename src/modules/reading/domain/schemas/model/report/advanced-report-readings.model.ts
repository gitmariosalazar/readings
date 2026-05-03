export class AdvancedReportReadingsModel {
  constructor(
    public readonly sector: number,
    public readonly totalConnections: number,
    public readonly readingsCompleted: number,
    public readonly missingReadings: number,
    public readonly progressPercentage: number,
    public readonly pureActiveUnits: number,
    public readonly suspendedOrArrearsWithReading: number,
    public readonly dataDiscrepancy: number,
    public readonly totalVisitEfficiency: number,
    // Cross-validation from auditoria_lectura_sector (0 / false if not yet generated)
    public readonly auditTotalEsperado: number = 0,
    public readonly auditTotalCompletadas: number = 0,
    public readonly auditAvancePorcentaje: number = 0,
    public readonly auditCompleto: boolean = false,
  ) {}
}
