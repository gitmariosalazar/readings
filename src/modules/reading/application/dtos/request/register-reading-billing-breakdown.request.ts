import {
  ReadingConceptDetailRequest,
  ReadingWaterCalculationRequest,
} from './create.calculate-reading-value.request';

export class RegisterReadingBillingBreakdownRequest {
  conceptDetails!: ReadingConceptDetailRequest[];
  waterCalculation!: ReadingWaterCalculationRequest;
}
