export class ReadingWaterCalculationModel {
  public readingId: number;
  public categoryId: number;
  public tariffName: string | null;
  public minRange: number | null;
  public maxRange: number | null;
  public appliedBase: number | null;
  public additionalRatePerM3: number | null;
  public additionalM3: number | null;
  public waterAmount: number;
  public formula: string | null;
  public tariffStructureVersion: string | null;

  constructor(data: {
    readingId: number;
    categoryId: number;
    tariffName: string | null;
    minRange: number | null;
    maxRange: number | null;
    appliedBase: number | null;
    additionalRatePerM3: number | null;
    additionalM3: number | null;
    waterAmount: number;
    formula: string | null;
    tariffStructureVersion: string | null;
  }) {
    this.readingId = data.readingId;
    this.categoryId = data.categoryId;
    this.tariffName = data.tariffName;
    this.minRange = data.minRange;
    this.maxRange = data.maxRange;
    this.appliedBase = data.appliedBase;
    this.additionalRatePerM3 = data.additionalRatePerM3;
    this.additionalM3 = data.additionalM3;
    this.waterAmount = data.waterAmount;
    this.formula = data.formula;
    this.tariffStructureVersion = data.tariffStructureVersion;
  }
}
