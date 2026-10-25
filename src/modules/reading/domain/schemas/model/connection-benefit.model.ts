export class ConnectionBenefitModel {
  constructor(
    public readonly id: string,
    public readonly connectionId: string,
    public readonly clientId: string,
    public readonly benefitTypeId: number,
    public readonly conceptId: number,
    public readonly conceptCode: string,
    public readonly benefitTypeCode: string,
    public readonly benefitTypeName: string,
    public readonly benefitGroup: string,
    public readonly isCumulative: boolean,
    public readonly effectivePercentage: number,
    public readonly m3Limit: number | null,
    public readonly versionCode: string | null,
    public readonly appliesToConcept: string = 'AGUA',
    public readonly subsidizesSewerage: boolean = false,
    public readonly disabilityPercentage: number | null = null,
  ) {}
}
