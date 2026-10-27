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
            // Deduplicación defensiva por concepto_id preservando prioridad de montos no-cero
            const uniqueDetailsMap = new Map<number, ReadingConceptDetailModel>();
            for (const d of conceptDetails) {
              const existing = uniqueDetailsMap.get(d.conceptId);
              if (!existing) {
                uniqueDetailsMap.set(d.conceptId, d);
              } else if (existing.amount === 0 && d.amount !== 0) {
                uniqueDetailsMap.set(d.conceptId, d);
              }
            }
            const dedupedDetails = Array.from(uniqueDetailsMap.values());

            const columnsPerRow = 7;
            const placeholders = dedupedDetails
              .map((_, i) => {
                const o = i * columnsPerRow;
                return `($${o + 1}, $${o + 2}, $${o + 3}, $${o + 4}, $${o + 5}, $${o + 6}, $${o + 7})`;
              })
              .join(', ');
            const params = dedupedDetails.flatMap((d) => [
              d.readingId,
              d.conceptId,
              d.validityConceptId ?? 0,
              d.versionSheet ?? null,
              d.amount ?? 0,
              d.calculationBase != null ? d.calculationBase : null,
              d.formula ?? null,
            ]);

            await client.execute(
              /*sql*/ `
              INSERT INTO public.detalle_concepto_lectura
                (lectura_id, concepto_id, vigencia_concepto_id, pliego_version, valor, base_calculo, formula)
              VALUES ${placeholders}
              ON CONFLICT (lectura_id, concepto_id) DO UPDATE SET
                vigencia_concepto_id = EXCLUDED.vigencia_concepto_id,
                pliego_version = EXCLUDED.pliego_version,
                valor = EXCLUDED.valor,
                base_calculo = EXCLUDED.base_calculo,
                formula = EXCLUDED.formula;
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
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            ON CONFLICT (lectura_id) DO UPDATE SET
              categoria_id = EXCLUDED.categoria_id,
              nombre_tarifa = EXCLUDED.nombre_tarifa,
              rango_minimo = EXCLUDED.rango_minimo,
              rango_maximo = EXCLUDED.rango_maximo,
              base_aplicada = EXCLUDED.base_aplicada,
              valor_adicional_m3 = EXCLUDED.valor_adicional_m3,
              m3_adicionales = EXCLUDED.m3_adicionales,
              valor_agua = EXCLUDED.valor_agua,
              formula = EXCLUDED.formula,
              pliego_version = EXCLUDED.pliego_version;
          `,
            [
              waterCalculation.readingId,
              waterCalculation.categoryId,
              waterCalculation.tariffName ?? null,
              waterCalculation.minRange ?? null,
              waterCalculation.maxRange ?? null,
              waterCalculation.appliedBase ?? null,
              waterCalculation.additionalRatePerM3 ?? null,
              waterCalculation.additionalM3 ?? null,
              waterCalculation.waterAmount ?? 0,
              waterCalculation.formula ?? null,
              waterCalculation.tariffStructureVersion ?? null,
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
