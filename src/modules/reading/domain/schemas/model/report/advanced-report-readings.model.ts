export class AdvancedReportReadingsModel {
  constructor(
    public readonly sector: number,
    public readonly totalConnections: number,
    public readonly readingsCompleted: number,
    public readonly missingReadings: number,
    public readonly progressPercentage: number,
  ) {}
}
