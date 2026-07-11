import { UUID } from 'crypto';

export class IncidentModel {
  constructor(
    public readonly id: string, // UUID
    public readonly connectionId: string | null,
    public readonly incidentCode: string,
    public readonly readingId: number | null,
    public readonly incidentTypeId: number,
    public readonly reportDescription: string,
    public readonly referenceAddress: string | null,
    public readonly status: string, // 'REPORTADO', 'EN_INSPECCION', 'RESUELTO', 'FALSO_REPORTE'
    public readonly reportOrigin: string, // 'LECTURISTA', 'ATENCION_AL_CLIENTE', 'INSPECTOR', 'WEB_USUARIO'
    public readonly priority: string, // 'BAJA', 'MEDIA', 'ALTA', 'CRITICA'
    public readonly reportDate: Date,
    public readonly reporterUserId: UUID | null,
    public readonly clienteUsuarioReportaId: UUID | null,
    public readonly coordinates: { lat: number; lng: number } | null,

    // Resolution fields
    public readonly resolutionDate: Date | null,
    public readonly resolverUserId: UUID | null,
    public readonly resolutionDescription: string | null,

    // Financial and billing parameters
    public readonly chargeToUser: boolean,
    public readonly repairCost: number,

    // Rich query-only fields
    public readonly categoryName?: string | null,
    public readonly categoryCode?: string | null,
    public readonly incidentTypeName?: string | null,
    public readonly suggestedPriority?: string | null,
    public readonly reportedBy?: string | null,
    public readonly evidencePhotos?: Array<{
      photoId: number;
      filePath: string;
      type: string;
    }> | null,
    public readonly statusHistory?: Array<{
      changeDate: string | Date;
      previousStatus: string | null;
      newStatus: string;
      managedBy: string | null;
      observation: string | null;
    }> | null,
    public readonly reportClient?: {
      nombre: string;
      apellido: string;
      correo: string | null;
      celular: string | null;
    } | null,
  ) {}

  public isChargeableToUser(): boolean {
    return this.chargeToUser && this.repairCost > 0;
  }
}
