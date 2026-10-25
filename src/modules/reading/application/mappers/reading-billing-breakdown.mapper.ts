import {
  ReadingConceptDetailRequest,
  ReadingWaterCalculationRequest,
} from '../dtos/request/create.calculate-reading-value.request';
import { CalculationBreakdown } from '../../domain/schemas/model/calculate-reading-value.model';
import { ReadingConceptDetailModel } from '../../domain/schemas/model/reading-concept-detail.model';
import { ReadingWaterCalculationModel } from '../../domain/schemas/model/reading-water-calculation.model';

export class ReadingBillingBreakdownMapper {
  static fromConceptDetailRequestToModel(
    request: ReadingConceptDetailRequest,
  ): ReadingConceptDetailModel {
    return new ReadingConceptDetailModel({
      readingId: Number(request.readingId),
      conceptId: Number(request.conceptId),
      amount: Number(request.amount),
      calculationBase: this.toNullableNumber(request.calculationBase),
      formula: request.formula ?? null,
      validityConceptId: Number(request.validityConceptId),
      versionSheet: request.versionSheet ?? null,
    });
  }

  static fromWaterCalculationRequestToModel(
    request: ReadingWaterCalculationRequest,
  ): ReadingWaterCalculationModel {
    return new ReadingWaterCalculationModel({
      readingId: Number(request.readingId),
      categoryId: Number(request.categoryId),
      tariffName: request.tariffName ?? null,
      minRange: this.toNullableNumber(request.minRange),
      maxRange: this.toNullableNumber(request.maxRange),
      appliedBase: this.toNullableNumber(request.appliedBase),
      additionalRatePerM3: this.toNullableNumber(request.additionalRatePerM3),
      additionalM3: this.toNullableNumber(request.additionalM3),
      waterAmount: Number(request.waterAmount),
      formula: request.formula ?? null,
      tariffStructureVersion: request.tariffStructureVersion ?? null,
    });
  }

  static fromCalculationBreakdownToModels(
    readingId: number,
    breakdown: CalculationBreakdown,
  ): {
    conceptDetails: ReadingConceptDetailModel[];
    waterCalculation: ReadingWaterCalculationModel;
  } {
    const { water, concepts } = breakdown;
    return {
      conceptDetails: concepts.map(
        (c) =>
          new ReadingConceptDetailModel({
            readingId,
            conceptId: c.conceptId,
            amount: c.amount,
            calculationBase: c.calculationBase,
            formula: c.formula,
            validityConceptId: c.validityConceptId,
            versionSheet: c.versionSheet ?? null,
          }),
      ),
      waterCalculation: new ReadingWaterCalculationModel({
        readingId,
        categoryId: water.categoryId,
        tariffName: water.tariffName,
        minRange: water.minRange,
        maxRange: water.maxRange,
        appliedBase: water.appliedBase,
        additionalRatePerM3: water.additionalRatePerM3,
        additionalM3: water.additionalM3,
        waterAmount: water.waterAmount,
        formula: water.formula,
        tariffStructureVersion: water.tariffStructureVersion,
      }),
    };
  }

  private static toNullableNumber(value: number | null | undefined) {
    return value === null || value === undefined ? null : Number(value);
  }
}
