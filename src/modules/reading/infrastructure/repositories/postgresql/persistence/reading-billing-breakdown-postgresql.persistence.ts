import { Injectable } from '@nestjs/common';
import {
  DatabaseAbstract,
  IDatabaseClient,
} from '../../../../../../shared/connections/database/abstract/abstract.database';
import { InterfaceReadingBillingBreakdownRepository } from '../../../../domain/contracts/reading-billing-breakdown.interface.repository';
import { ReadingConceptDetailModel } from '../../../../domain/schemas/model/reading-concept-detail.model';
import { ReadingWaterCalculationModel } from '../../../../domain/schemas/model/reading-water-calculation.model';

@Injectable()
export class ReadingBillingBreakdownPostgreSQLPersistence implements InterfaceReadingBillingBreakdownRepository {
  constructor(private readonly databaseService: DatabaseAbstract) {}

  async saveBillingBreakdown(
    conceptDetails: ReadingConceptDetailModel[],
    waterCalculation: ReadingWaterCalculationModel,
  ): Promise<void> {
    try {
      await this.databaseService.transaction(
        async (client: IDatabaseClient) => {
          // Reemplazo idempotente: limpiar desglose previo de esta lectura
          await client.execute(
            /*sql*/ `
            DELETE FROM public.lectura_calculo_valor_agua WHERE lectura_id = $1;
          `,
            [waterCalculation.readingId],
          );

          await client.execute(
            /*sql*/ `
            DELETE FROM public.detalle_concepto_lectura WHERE lectura_id = $1;
          `,
            [waterCalculation.readingId],
          );

          if (conceptDetails.length > 0) {
            const columnsPerRow = 7;
            const placeholders = conceptDetails
              .map((_, i) => {
                const o = i * columnsPerRow;
                return `($${o + 1}, $${o + 2}, $${o + 3}, $${o + 4}, $${o + 5}, $${o + 6}, $${o + 7})`;
              })
              .join(', ');
            const params = conceptDetails.flatMap((d) => [
              d.readingId,
              d.conceptId,
              d.validityConceptId,
              d.versionSheet,
              d.amount,
              d.calculationBase,
              d.formula,
            ]);

            await client.execute(
              /*sql*/ `
              INSERT INTO public.detalle_concepto_lectura
                (lectura_id, concepto_id,vigencia_concepto_id,pliego_version, valor, base_calculo, formula)
              VALUES ${placeholders};
            `,
              params,
            );
          }

          await client.execute(
            /*sql*/ `
            INSERT INTO public.lectura_calculo_valor_agua
              (lectura_id, categoria_id, nombre_tarifa, rango_minimo, rango_maximo,
               base_aplicada, valor_adicional_m3, m3_adicionales, valor_agua,
               formula, pliego_version)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);
          `,
            [
              waterCalculation.readingId,
              waterCalculation.categoryId,
              waterCalculation.tariffName,
              waterCalculation.minRange,
              waterCalculation.maxRange,
              waterCalculation.appliedBase,
              waterCalculation.additionalRatePerM3,
              waterCalculation.additionalM3,
              waterCalculation.waterAmount,
              waterCalculation.formula,
              waterCalculation.tariffStructureVersion,
            ],
          );
        },
      );
    } catch (error) {
      console.error('[ERROR] Error al guardar el desglose de cobro:', error);
      throw error;
    }
  }
}
