import { Inject, Injectable } from '@nestjs/common';
import { InterfaceReadingBillingBreakdownRepository } from '../../domain/contracts/reading-billing-breakdown.interface.repository';
import { CalculateReadingValueModel } from '../../domain/schemas/model/calculate-reading-value.model';
import { ReadingBillingBreakdownMapper } from '../mappers/reading-billing-breakdown.mapper';

@Injectable()
export class ReadingBillingBreakdownRecorder {
  constructor(
    @Inject('ReadingBillingBreakdownRepository')
    private readonly breakdownRepository: InterfaceReadingBillingBreakdownRepository,
  ) {}

  // La lectura ya fue persistida: un fallo aquí no debe invalidarla (un reintento
  // del cliente chocaría con el control de duplicados), solo se registra.
  async record(
    readingId: number,
    calculation: CalculateReadingValueModel,
  ): Promise<void> {
    if (!calculation.breakdown) {
      return;
    }
    try {
      const { conceptDetails, waterCalculation } =
        ReadingBillingBreakdownMapper.fromCalculationBreakdownToModels(
          readingId,
          calculation.breakdown,
        );
      await this.breakdownRepository.saveBillingBreakdown(
        conceptDetails,
        waterCalculation,
      );
    } catch (error) {
      console.error(
        `[ERROR] No se pudo registrar el desglose de cobro de la lectura ${readingId}:`,
        error,
      );
    }
  }
}
