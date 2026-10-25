export class ReadingConceptDetailModel {
  public readingId: number;
  public conceptId: number;
  public amount: number;
  public calculationBase: number | null;
  public formula: string | null;
  public validityConceptId: number;
  public versionSheet: string | null;

  constructor(data: {
    readingId: number;
    conceptId: number;
    amount: number;
    calculationBase: number | null;
    formula: string | null;
    validityConceptId?: number;
    versionSheet?: string | null;
  }) {
    this.readingId = data.readingId;
    this.conceptId = data.conceptId;
    this.amount = data.amount;
    this.calculationBase = data.calculationBase;
    this.formula = data.formula;
    this.validityConceptId = data.validityConceptId ?? 0;
    this.versionSheet = data.versionSheet ?? null;
  }
}
