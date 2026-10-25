import { Injectable } from '@nestjs/common';
import {
  DatabaseAbstract,
  IDatabaseClient,
} from '../../../../../../shared/connections/database/abstract/abstract.database';
import { InterfaceReadingBillingBreakdownRepository } from '../../../../domain/contracts/reading-billing-breakdown.interface.repository';
import { ReadingConceptDetailModel } from '../../../../domain/schemas/model/reading-concept-detail.model';
import { ReadingWaterCalculationModel } from '../../../../domain/schemas/model/reading-water-calculation.model';

@Injectable()
export class ReadingBillingBreakdownMySQLPersistence implements InterfaceReadingBillingBreakdownRepository {
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
            DELETE FROM lectura_calculo_valor_agua WHERE lectura_id = ?;
          `,
            [waterCalculation.readingId],
          );

          await client.execute(
            /*sql*/ `
            DELETE FROM detalle_concepto_lectura WHERE lectura_id = ?;
          `,
            [waterCalculation.readingId],
          );

          if (conceptDetails.length > 0) {
            const placeholders = conceptDetails
              .map(() => '(?, ?, ?, ?, ?)')
              .join(', ');
            const params = conceptDetails.flatMap((d) => [
              d.readingId,
              d.conceptId,
              d.amount,
              d.calculationBase,
              d.formula,
            ]);

            await client.execute(
              /*sql*/ `
              INSERT INTO detalle_concepto_lectura
                (lectura_id, concepto_id, valor, base_calculo, formula)
              VALUES ${placeholders};
            `,
              params,
            );
          }

          await client.execute(
            /*sql*/ `
            INSERT INTO lectura_calculo_valor_agua
              (lectura_id, categoria_id, nombre_tarifa, rango_minimo, rango_maximo,
               base_aplicada, valor_adicional_m3, m3_adicionales, valor_agua,
               formula, pliego_version)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
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
