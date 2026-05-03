export class AuditSectorModel {
  constructor(
    public readonly auditId: number,
    public readonly readingMonth: Date, // mesLectura
    public readonly sectorId: number,
    public readonly expectedTotal: number, // totalEsperado
    public readonly completedTotal: number, // totalCompletadas
    public readonly pendingTotal: number, // totalPendientes
    public readonly progressPercentage: number, // avancePorcentaje
    public readonly isComplete: boolean, // completo
    public readonly closureDate: Date | null, // fechaCierre
    public readonly supervisorId: string | null,
    public readonly observations: string | null, // observaciones
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}

export class AuditSectorHistoryModel {
  constructor(
    public readonly readingMonth: Date,
    public readonly sectorId: number,
    public readonly expectedTotal: number,
    public readonly completedTotal: number,
    public readonly progressPercentage: number,
    public readonly isComplete: boolean,
    public readonly closureDate: Date | null,
    public readonly supervisorId: string | null,
    public readonly observations: string | null,
    public readonly createdAt: Date,
  ) {}
}

export class CloseAuditSectorModel {
  constructor(
    public readonly auditId: number,
    public readonly sectorId: number,
    public readonly readingMonth: Date,
    public readonly isComplete: boolean,
    public readonly closureDate: Date,
    public readonly supervisorId: string | null,
    public readonly observations: string | null,
    public readonly createdAt: Date,
  ) {}
}

export class InitializeAuditModel {
  constructor(
    public readonly message: string,
    public readonly period: string,
    public readonly sectorsGenerated: number,
  ) {}
}
