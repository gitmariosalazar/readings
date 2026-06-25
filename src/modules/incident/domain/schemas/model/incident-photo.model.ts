export class IncidentPhotoModel {
  constructor(
    public readonly id: number,
    public readonly incidentId: number,
    public readonly filePath: string,
    public readonly photoType: 'REPORTE' | 'RESOLUCION',
    public readonly createdAt: Date,
  ) {}
}
