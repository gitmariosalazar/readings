import { Injectable } from '@nestjs/common';
import {
  ConceptCalculationContext,
  InterfaceConceptCalculationStrategy,
} from '../../../domain/contracts/concept-calculation-strategy.interface';
import { BillingConceptValidity } from '../../../infrastructure/interfaces/sql/reading-sql.result.interface';
import {
  CalculationConceptBreakdown,
  RateRangeModel,
} from '../../../domain/schemas/model/calculate-reading-value.model';
import { ConnectionBenefitModel } from '../../../domain/schemas/model/connection-benefit.model';

/**
 * Estrategia para el cálculo de conceptos de descuento y subsidios (Tercera Edad, Discapacidad, Cruz Roja, etc.).
 *
 * Aplica las reglas del marco legal ecuatoriano (LOPAM, Ley de Discapacidades, COOTAD):
 * 1. Los subsidios sociales aplican sobre el consumo básico residencial (tope legal de 20 m³).
 *    El consumo excedente se factura a tarifa ordinaria sin subsidio.
 * 2. Convenios institucionales o comerciales (ej. Cruz Roja) aplican sobre la base total sin tope de m³.
 * 3. Exclusión mutua por grupo no acumulable: si un abonado califica para Tercera Edad y Discapacidad,
 *    se aplica automáticamente el beneficio de mayor porcentaje.
 * 4. Los convenios acumulables (ej. Cruz Roja) coexisten con los subsidios de vulnerabilidad.
 * 5. Se generan montos negativos para deducir contablemente en el detalle de la lectura.
 */
@Injectable()
export class DiscountConceptStrategy
  implements InterfaceConceptCalculationStrategy
{
  readonly priority = 60; // Mayor prioridad que PercentageConceptStrategy (50) y DefaultConceptStrategy (0)

  canHandle(concept: BillingConceptValidity): boolean {
    return (
      concept.code.startsWith('DESC_') ||
      concept.code.startsWith('SUBSIDIO_') ||
      concept.code.includes('DESCUENTO')
    );
  }

  calculate(
    concept: BillingConceptValidity,
    context: ConceptCalculationContext,
  ): CalculationConceptBreakdown {
    const activeBenefits = context.activeBenefits ?? [];

    // 1. Buscar si esta acometida tiene asignado este beneficio
    const matchingBenefit = activeBenefits.find(
      (b) =>
        b.conceptId === Number(concept.conceptId) ||
        b.conceptCode === concept.code,
    );

    // Si no tiene asignado el beneficio, retorna monto 0 (no aplica)
    if (!matchingBenefit) {
      return this.buildZeroBreakdown(concept);
    }

    // 2. Control de exclusión mutua en beneficios no acumulables del mismo grupo (ej. VULNERABILIDAD)
    if (!matchingBenefit.isCumulative) {
      const sameGroupNonCumulative = activeBenefits.filter(
        (b) =>
          b.benefitGroup === matchingBenefit.benefitGroup && !b.isCumulative,
      );

      if (sameGroupNonCumulative.length > 1) {
        // Encontrar el beneficio con mayor porcentaje efectivo en el grupo
        const bestBenefit = sameGroupNonCumulative.reduce((best, curr) =>
          Number(curr.effectivePercentage) > Number(best.effectivePercentage)
            ? curr
            : best,
        );

        // Si este beneficio no es el de mayor porcentaje, queda excluido (monto 0)
        if (
          bestBenefit.conceptId !== matchingBenefit.conceptId &&
          bestBenefit.conceptCode !== matchingBenefit.conceptCode
        ) {
          return this.buildZeroBreakdown(concept);
        }
      }
    }

    const effectivePercentage = Number(matchingBenefit.effectivePercentage);
    if (effectivePercentage <= 0) {
      return this.buildZeroBreakdown(concept);
    }

    const discountRate = effectivePercentage / 100;
    const limitM3 =
      matchingBenefit.m3Limit != null && Number(matchingBenefit.m3Limit) > 0
        ? Number(matchingBenefit.m3Limit)
        : null;
    const consumptionM3 = context.consumptionM3 ?? 0;

    // 3. Determinar el consumo base subsidiable (con tope si está definido)
    const subsidizedM3 =
      limitM3 != null ? Math.min(consumptionM3, limitM3) : consumptionM3;

    // 4. Calcular el costo de agua correspondiente a los m³ subsidiados
    let subsidizedWaterBase = 0;
    if (limitM3 == null) {
      // Sin tope (ej. Cruz Roja): descuenta sobre el monto total de agua facturado
      subsidizedWaterBase = context.waterCalculation?.waterAmount ?? 0;
    } else {
      // Con tope legal de consumo básico (ej. 20 m³): calcula el costo de los primeros N m³
      subsidizedWaterBase = this.calculateWaterValueForM3(
        subsidizedM3,
        context.rateRanges,
        context.matchedRange,
      );
    }

    // 5. Calcular monto del descuento (valor negativo)
    const rawDiscount = subsidizedWaterBase * discountRate;
    const discountAmount = -Number(rawDiscount.toFixed(2));
    const baseFormatted = Number(subsidizedWaterBase.toFixed(2));

    // 6. Fórmula explicativa para auditoría y factura electrónica
    const formula =
      limitM3 != null
        ? `-(${baseFormatted.toFixed(2)} * ${discountRate}) [Tope ${limitM3} m³]`
        : `-(${baseFormatted.toFixed(2)} * ${discountRate}) [Convenio]`;

    // 7. Versión del pliego o de la ordenanza del beneficio
    const versionSheet = matchingBenefit.versionCode
      ? `${concept.code}-V-${matchingBenefit.versionCode}`
      : concept.versionSheet ?? null;

    return {
      conceptId: Number(concept.conceptId),
      amount: discountAmount,
      calculationBase: baseFormatted,
      formula,
      validityConceptId:
        concept.validityConceptId != null
          ? Number(concept.validityConceptId)
          : undefined,
      versionSheet,
    };
  }

  /**
   * Calcula el valor de agua correspondiente a un volumen específico de m³
   * aplicando la estructura tarifaria correspondiente a dicho volumen.
   */
  private calculateWaterValueForM3(
    m3: number,
    rateRanges?: RateRangeModel[],
    fallbackRange?: RateRangeModel | null,
  ): number {
    if (m3 < 0) return 0;

    // Buscar el rango tarifario que contiene a estos m3
    let range: RateRangeModel | null | undefined = fallbackRange;

    if (rateRanges && rateRanges.length > 0) {
      const bMinimo = Number(rateRanges[0].min);
      for (const r of rateRanges) {
        const min = Number(r.min);
        const max = Number(r.max);
        const lowerBound = min > bMinimo ? min - 1 : min;

        if (m3 >= lowerBound && m3 <= max) {
          range = r;
          break;
        }
      }
    }

    if (!range) {
      return 0;
    }

    const base = Number(range.base);
    const additional = Number(range.additional);

    // Consumo básico (primeros 10 m3)
    if (m3 <= 10) {
      return base;
    }

    const additionalM3 = m3 - (Number(range.min) - 1);
    return base + additionalM3 * additional;
  }

  private buildZeroBreakdown(
    concept: BillingConceptValidity,
  ): CalculationConceptBreakdown {
    return {
      conceptId: Number(concept.conceptId),
      amount: 0,
      calculationBase: null,
      formula: '0',
      validityConceptId:
        concept.validityConceptId != null
          ? Number(concept.validityConceptId)
          : undefined,
      versionSheet: concept.versionSheet ?? null,
    };
  }
}
