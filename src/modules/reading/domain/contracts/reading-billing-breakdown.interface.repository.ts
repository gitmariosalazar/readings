import { ReadingConceptDetailModel } from '../schemas/model/reading-concept-detail.model';
import { ReadingWaterCalculationModel } from '../schemas/model/reading-water-calculation.model';

export interface InterfaceReadingBillingBreakdownRepository {
  // Persiste el detalle por concepto y el cálculo del agua de forma atómica.
  saveBillingBreakdown(
    conceptDetails: ReadingConceptDetailModel[],
    waterCalculation: ReadingWaterCalculationModel,
  ): Promise<void>;
}
