export class IncidentCategoryModel {
  constructor(
    public readonly id: number,
    public readonly code: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly isActive: boolean,
  ) {}
}
