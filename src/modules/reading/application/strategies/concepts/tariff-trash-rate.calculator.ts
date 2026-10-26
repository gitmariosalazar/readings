import { TrashRateCategoryTariffModel } from '../../../domain/schemas/model/trash-rate.model';

export interface TrashRateCalculationResult {
  amount: number;
  formula: string;
  versionSheet: string;
  calculationBase: number;
}

/**
 * Calculador de Dominio / Aplicación para la Tasa de Basura según el Pliego Tarifario.
 * Implementa las Reglas 2, 3 y 4 del módulo de Tasa de Basura:
 * - COMERCIAL: $20.44 fijo.
 * - INDUSTRIAL: $53.04 fijo.
 * - RESIDENCIAL: Escalonado por consumo en m3:
 *     0 - 10: $2.31
 *    11 - 30: $3.33
 *    31 - 50: $4.66
 *    51 - 100: $11.02
 *   101 - 200: $12.85
 *   >= 201: $19.26
 *   ELSE: $2.31
 * - OTRAS CATEGORÍAS: $0.00
 * - PISO MÍNIMO (Regla 4): Mínimo $1.00 en cualquier caso.
 */
export class TariffTrashRateCalculator {
  public static readonly MINIMUM_FLOOR = 1.0;
  public static readonly DEFAULT_VERSION_SHEET = 'TB-V1-2026';

  /**
   * Ejecuta el cálculo tarifario paramétrico para una acometida sin asignación fija.
   */
  public static calculate(
    categoryName: string,
    consumptionM3: number,
    tariffConfig?: TrashRateCategoryTariffModel | null,
  ): TrashRateCalculationResult {
    const normalizedCategory = (categoryName || '').toUpperCase().trim();
    const safeConsumption = Number.isFinite(consumptionM3) && consumptionM3 >= 0 ? consumptionM3 : 0;
    const versionSheet = tariffConfig?.versionSheet || this.DEFAULT_VERSION_SHEET;

    // 1. Si existe configuración paramétrica cargada desde Base de Datos
    if (tariffConfig) {
      if (tariffConfig.billingType === 'FIJO' && tariffConfig.fixedValue != null) {
        const rawAmount = Number(tariffConfig.fixedValue);
        const minAllowed = Math.max(Number(tariffConfig.minimumValue ?? 1.0), this.MINIMUM_FLOOR);
        const finalAmount = Math.max(rawAmount, minAllowed);

        return {
          amount: Number(finalAmount.toFixed(2)),
          calculationBase: safeConsumption,
          formula: `Tarifa fija [${normalizedCategory}]: $${rawAmount.toFixed(2)} (Mínimo: $${finalAmount.toFixed(2)}) [${versionSheet}]`,
          versionSheet,
        };
      }

      if (
        tariffConfig.billingType === 'POR_RANGOS_CONSUMO' &&
        tariffConfig.ranges &&
        tariffConfig.ranges.length > 0
      ) {
        const matched = tariffConfig.ranges.find(
          (r) => safeConsumption >= r.minRange && safeConsumption <= r.maxRange,
        );
        const rawAmount = matched ? Number(matched.value) : 2.31;
        const minAllowed = Math.max(Number(tariffConfig.minimumValue ?? 1.0), this.MINIMUM_FLOOR);
        const finalAmount = Math.max(rawAmount, minAllowed);
        const rangeText = matched ? `${matched.minRange}-${matched.maxRange}` : 'por defecto';

        return {
          amount: Number(finalAmount.toFixed(2)),
          calculationBase: safeConsumption,
          formula: `Tarifa [${normalizedCategory}] rango ${rangeText} m3 (${safeConsumption} m3): $${rawAmount.toFixed(2)} [${versionSheet}]`,
          versionSheet: matched?.versionSheet ?? versionSheet,
        };
      }
    }

    // 2. Fallback estándar según especificación de las Reglas de Negocio
    let rawCalculated = 0.0;
    let detailFormula = '';

    if (normalizedCategory === 'COMERCIAL') {
      rawCalculated = 20.44;
      detailFormula = `Tarifa fija COMERCIAL: $20.44 [${versionSheet}]`;
    } else if (normalizedCategory === 'INDUSTRIAL') {
      rawCalculated = 53.04;
      detailFormula = `Tarifa fija INDUSTRIAL: $53.04 [${versionSheet}]`;
    } else if (normalizedCategory === 'RESIDENCIAL') {
      if (safeConsumption >= 0 && safeConsumption <= 10) {
        rawCalculated = 2.31;
      } else if (safeConsumption >= 11 && safeConsumption <= 30) {
        rawCalculated = 3.33;
      } else if (safeConsumption >= 31 && safeConsumption <= 50) {
        rawCalculated = 4.66;
      } else if (safeConsumption >= 51 && safeConsumption <= 100) {
        rawCalculated = 11.02;
      } else if (safeConsumption >= 101 && safeConsumption <= 200) {
        rawCalculated = 12.85;
      } else if (safeConsumption >= 201) {
        rawCalculated = 19.26;
      } else {
        rawCalculated = 2.31;
      }
      detailFormula = `Tarifa RESIDENCIAL consumo ${safeConsumption} m3: $${rawCalculated.toFixed(2)} [${versionSheet}]`;
    } else {
      rawCalculated = 0.0;
      detailFormula = `Tarifa por defecto [${normalizedCategory || 'SIN CATEGORÍA'}]: $0.00 [${versionSheet}]`;
    }

    // Regla 4: Piso mínimo de $1.00 en el peor de los casos
    const finalAmount = Math.max(rawCalculated, this.MINIMUM_FLOOR);
    if (finalAmount > rawCalculated) {
      detailFormula += ` (Ajuste a piso mínimo de $${this.MINIMUM_FLOOR.toFixed(2)})`;
    }

    return {
      amount: Number(finalAmount.toFixed(2)),
      calculationBase: safeConsumption,
      formula: detailFormula,
      versionSheet,
    };
  }
}
