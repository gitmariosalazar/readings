import { Inject, Injectable, Logger, Optional } from '@nestjs/common';
import { InterfaceReadingRepository } from '../../../domain/contracts/reading.interface.repository';
import {
  CalculateReadingValueResponse,
  RateConnectionResponse,
  RateRangeResponse,
} from '../../dtos/response/reading.response';
import { ReadingMapper } from '../../mappers/reading.mapper';
import {
  CalculateReadingValueModel,
  CalculationBreakdown,
  CalculationConceptBreakdown,
  CalculationWaterBreakdown,
  RateRangeModel,
} from '../../../domain/schemas/model/calculate-reading-value.model';
import { BillingConceptValidity } from '../../../infrastructure/interfaces/sql/reading-sql.result.interface';
import { ConceptCalculationContext } from '../../../domain/contracts/concept-calculation-strategy.interface';
import { ConceptCalculationStrategyResolver } from '../../strategies/concepts/concept-calculation-strategy-resolver.service';

@Injectable()
export class CalculateReadingValueUseCase {
  private readonly logger = new Logger(CalculateReadingValueUseCase.name);

  // Códigos de conceptos de negocio
  private readonly SEWERAGE_CONCEPT_CODE = 'ALCANTARILLADO';
  private readonly COMMERCIALIZATION_CONCEPT_CODE = 'COMERCIALIZACION';
  private readonly WATER_CONCEPT_CODE = 'AGUA';
  private readonly BASE_CONSUMPTION_THRESHOLD_M3 = 10;

  private readonly strategyResolver: ConceptCalculationStrategyResolver;

  constructor(
    @Inject('ReadingRepository')
    private readonly readingRepository: InterfaceReadingRepository,
    @Optional()
    strategyResolver?: ConceptCalculationStrategyResolver,
  ) {
    this.strategyResolver =
      strategyResolver ?? new ConceptCalculationStrategyResolver();
  }

  /**
   * Obtiene el resolutor de estrategias de cálculo de conceptos.
   * Permite registrar o inspeccionar estrategias en tiempo de ejecución o pruebas.
   */
  getStrategyResolver(): ConceptCalculationStrategyResolver {
    return this.strategyResolver;
  }

  /**
   * Ejecuta el cálculo completo del valor de lectura aplicando las reglas de negocio,
   * tarifas escalonadas y desgloses de conceptos.
   *
   * @param cadastralKey Clave catastral de la acometida
   * @param consumptionM3 Consumo en metros cúbicos
   * @returns Modelo de dominio CalculateReadingValueModel con desglose para trazabilidad
   */
  async execute(
    cadastralKey: string,
    consumptionM3: number,
  ): Promise<CalculateReadingValueModel> {
    try {
      // 1. Validación de entrada (Regla de negocio)
      if (!this.isValidConsumption(consumptionM3)) {
        return this.buildDefaultResult(cadastralKey, consumptionM3);
      }

      // 2. Obtención de la categoría tarifaria de la acometida desde el repositorio
      const connectionRate =
        await this.readingRepository.getRateConnection(cadastralKey);

      if (!connectionRate) {
        return this.buildDefaultResult(cadastralKey, consumptionM3);
      }

      const categoryId: number = Number(connectionRate.categoryId);
      const rateName: string = connectionRate.categoryName || '';

      // 3. Obtención en paralelo de vigencia de conceptos, rangos tarifarios, beneficios activos, tasa de basura y diferimientos
      const [
        conceptValidityList,
        rateRanges,
        activeBenefits,
        activeTrashRate,
        pendingDeferrals,
      ] = await Promise.all([
        this.readingRepository.getBillingConceptValidity(),
        this.readingRepository.getRateRange(categoryId),
        this.readingRepository.getActiveBenefitsByCadastralKey
          ? this.readingRepository.getActiveBenefitsByCadastralKey(cadastralKey)
          : Promise.resolve([]),
        this.readingRepository.getActiveTrashRateByCadastralKey
          ? this.readingRepository.getActiveTrashRateByCadastralKey(cadastralKey)
          : Promise.resolve(null),
        this.readingRepository.getPendingConceptDeferrals
          ? this.readingRepository.getPendingConceptDeferrals(cadastralKey)
          : Promise.resolve([]),
      ]);

      if (!rateRanges || rateRanges.length === 0) {
        return this.buildDefaultResult(cadastralKey, consumptionM3, {
          rateName,
        });
      }

      // 4. Búsqueda del rango tarifario aplicable al consumo
      const matchedRange: RateRangeModel | null = this.findMatchingTariffRange(
        rateRanges,
        consumptionM3,
      );

      if (!matchedRange) {
        return this.buildDefaultResult(cadastralKey, consumptionM3, {
          rateName,
        });
      }

      // 5. Cálculo del cobro de agua según consumo base o adicional
      const waterCalculation = this.calculateWaterCharge(
        consumptionM3,
        matchedRange,
      );

      // 6. Contexto de cálculo para las estrategias
      const context: ConceptCalculationContext = {
        consumptionM3,
        matchedRange,
        rateRanges,
        rateName,
        categoryId,
        waterCalculation,
        waterVersionSheet: matchedRange?.versionSheet ?? null,
        activeBenefits: activeBenefits ?? [],
        cadastralKey,
        trashRateAssignment: activeTrashRate ?? null,
        fixedTrashRate: activeTrashRate?.assignedAmount ?? null,
        pendingDeferrals: pendingDeferrals ?? [],
      };

      // 7. Construcción de desgloses para auditoría y trazabilidad delegando en las estrategias
      const conceptsBreakdown = this.buildConceptsBreakdown(
        conceptValidityList,
        context,
      );

      const waterConcept = conceptValidityList.find(
        (c) => c.code === this.WATER_CONCEPT_CODE,
      );
      const sewerageConcept = conceptValidityList.find(
        (c) => c.code === this.SEWERAGE_CONCEPT_CODE,
      );

      const waterDetail = conceptsBreakdown.find(
        (c) => c.conceptId === Number(waterConcept?.conceptId),
      );
      const sewerageDetail = conceptsBreakdown.find(
        (c) => c.conceptId === Number(sewerageConcept?.conceptId),
      );

      const waterAmount = waterDetail
        ? Number(Number(waterDetail.amount).toFixed(2))
        : Number(Number(waterCalculation.waterAmount).toFixed(2));
      const sewerageValue = sewerageDetail
        ? Number(Number(sewerageDetail.amount).toFixed(2))
        : 0;
      const fixedRatePerM3 =
        consumptionM3 > 0 ? waterAmount / consumptionM3 : 0;

      const othersCharge = Number(
        conceptsBreakdown
          .filter(
            (c) =>
              c.conceptId !== Number(sewerageConcept?.conceptId) &&
              c.conceptId !== Number(waterConcept?.conceptId),
          )
          .reduce((sum, c) => sum + Number(c.amount), 0)
          .toFixed(2),
      );

      const waterBreakdown: CalculationWaterBreakdown = {
        categoryId,
        tariffName: rateName || null,
        minRange: matchedRange.min,
        maxRange: matchedRange.max,
        appliedBase: matchedRange.base,
        additionalRatePerM3: matchedRange.additional,
        additionalM3: waterCalculation.additionalM3,
        waterAmount: waterCalculation.waterAmount,
        formula: waterCalculation.formula,
        tariffStructureVersion: matchedRange?.versionSheet ?? null,
      };

      const breakdown: CalculationBreakdown = {
        water: waterBreakdown,
        concepts: conceptsBreakdown,
      };

      // 9. Construcción y retorno del modelo final
      return this.buildDefaultResult(cadastralKey, consumptionM3, {
        waterConsumptionValue: waterCalculation.waterAmount,
        baseRate: matchedRange.base,
        rateName,
        sewerageValue,
        others: othersCharge,
        additionalCost: matchedRange.additional,
        fixedRatePerM3,
        breakdown,
      });
    } catch (error) {
      this.logger.error(
        `[CalculateReadingValueUseCase] Error calculando consumo para clave "${cadastralKey}":`,
        error,
      );
      throw error;
    }
  }

  /**
   * Ejecuta el cálculo y retorna el DTO de respuesta para queries externos o controladores.
   */
  async executeCalculateReadingValue(
    cadastralKey: string,
    consumptionM3: number,
  ): Promise<CalculateReadingValueResponse> {
    const result = await this.execute(cadastralKey, consumptionM3);
    return ReadingMapper.fromCalculateReadingValueModelToCalculateReadingValueResponse(
      result,
    );
  }

  async executeGetRateConnection(
    cadastralKey: string,
  ): Promise<RateConnectionResponse> {
    const result = await this.readingRepository.getRateConnection(cadastralKey);
    return ReadingMapper.fromRateConnectionModelToRateConnectionResponse(
      result,
    );
  }

  async executeGetRateRange(tarifaId: number): Promise<RateRangeResponse[]> {
    const result = await this.readingRepository.getRateRange(tarifaId);
    return result.map((item) =>
      ReadingMapper.fromRateRangeModelToRateRangeResponse(item),
    );
  }

  // ==============================================================
  // Reglas de negocio privadas (SRP & Alta cohesión)
  // ==============================================================

  /**
   * Valida que el consumo sea un número finito no negativo.
   */
  private isValidConsumption(consumption: number): boolean {
    return Number.isFinite(consumption) && consumption >= 0;
  }

  /**
   * Localiza el rango tarifario aplicable al volumen de consumo provisto.
   */
  private findMatchingTariffRange(
    rateRanges: RateRangeModel[],
    consumptionM3: number,
  ): RateRangeModel | null {
    if (!rateRanges || rateRanges.length === 0) return null;

    const bMinimo = Number(rateRanges[0].min);

    for (const range of rateRanges) {
      const min = Number(range.min);
      const max = Number(range.max);
      const lowerBound = min > bMinimo ? min - 1 : min;

      if (consumptionM3 >= lowerBound && consumptionM3 <= max) {
        return {
          versionSheet: range.versionSheet,
          min,
          max,
          base: Number(range.base),
          additional: Number(range.additional),
        };
      }
    }

    return null;
  }

  /**
   * Calcula el cobro de agua y su fórmula asociada según el consumo y el rango tarifario.
   */
  private calculateWaterCharge(
    consumptionM3: number,
    range: RateRangeModel,
  ): {
    waterAmount: number;
    additionalM3: number;
    appliedBase: number;
    formula: string;
  } {
    const bas = range.base;
    const adic = range.additional;

    if (
      consumptionM3 >= 0 &&
      consumptionM3 <= this.BASE_CONSUMPTION_THRESHOLD_M3
    ) {
      return {
        waterAmount: bas,
        additionalM3: 0,
        appliedBase: bas,
        formula: `${bas}`,
      };
    }

    const additionalM3 = consumptionM3 - (range.min - 1);
    const waterAmount = bas + additionalM3 * adic;
    const formula = `${bas} + (${additionalM3} * ${adic})`;

    return {
      waterAmount,
      additionalM3,
      appliedBase: bas,
      formula,
    };
  }

  /**
   * Genera el desglose estructurado de conceptos asegurando que TODOS los conceptos
   * vigentes retornados por getBillingConceptValidity sean calculados e incluidos en el detalle,
   * delegando cada concepto en su estrategia correspondiente (Patrón Strategy).
   */
  private buildConceptsBreakdown(
    conceptValidityList: BillingConceptValidity[],
    context: ConceptCalculationContext,
  ): CalculationConceptBreakdown[] {
    const conceptBreakdown: CalculationConceptBreakdown[] = [];

    // 1. Concepto ALCANTARILLADO (si existe en los conceptos vigentes)
    const sewerageConcept = conceptValidityList.find(
      (c) => c.code === this.SEWERAGE_CONCEPT_CODE,
    );
    if (sewerageConcept) {
      const detail = this.strategyResolver.calculate(sewerageConcept, context);
      conceptBreakdown.push(
        this.applyPendingDeferralIfAny(detail, sewerageConcept, context),
      );
    }

    // 2. Todos los demás conceptos vigentes (Aseo, Comercialización, rubros fijos, subsidios o descuentos)
    const otherConcepts = conceptValidityList.filter(
      (c) =>
        c.code !== this.SEWERAGE_CONCEPT_CODE &&
        c.code !== this.WATER_CONCEPT_CODE,
    );
    for (const concept of otherConcepts) {
      const detail = this.strategyResolver.calculate(concept, context);
      conceptBreakdown.push(
        this.applyPendingDeferralIfAny(detail, concept, context),
      );
    }

    // 3. Concepto AGUA (si existe en los conceptos vigentes)
    const waterConcept = conceptValidityList.find(
      (c) => c.code === this.WATER_CONCEPT_CODE,
    );
    if (waterConcept) {
      const detail = this.strategyResolver.calculate(waterConcept, context);
      conceptBreakdown.push(
        this.applyPendingDeferralIfAny(detail, waterConcept, context),
      );
    }

    return conceptBreakdown;
  }

  /**
   * Aplica saldos diferidos pendientes por convenio de pago a un concepto.
   * Si la acometida tiene un saldo diferido acumulado pendiente para este concepto,
   * se suma al monto regular de este mes y se añade a la fórmula para auditoría.
   */
  private applyPendingDeferralIfAny(
    detail: CalculationConceptBreakdown,
    concept: BillingConceptValidity,
    context: ConceptCalculationContext,
  ): CalculationConceptBreakdown {
    if (!context.pendingDeferrals || context.pendingDeferrals.length === 0) {
      return detail;
    }

    const deferral = context.pendingDeferrals.find(
      (d) =>
        d.conceptId === Number(concept.conceptId) ||
        (d.conceptCode && d.conceptCode === concept.code),
    );

    if (deferral && deferral.accumulatedAmount > 0) {
      const baseAmount = Number(detail.amount);
      const totalAmount = Number(
        (baseAmount + deferral.accumulatedAmount).toFixed(2),
      );
      return {
        ...detail,
        amount: totalAmount,
        formula: `${detail.formula} + Diferido Convenio ($${deferral.accumulatedAmount.toFixed(2)})`,
      };
    }

    return detail;
  }

  /**
   * Crea una instancia del modelo CalculateReadingValueModel con valores base o por defecto.
   */
  private buildDefaultResult(
    cadastralKey: string,
    consumptionM3: number,
    overrides: Partial<{
      waterConsumptionValue: number;
      baseRate: number;
      rateName: string;
      sewerageValue: number;
      others: number;
      additionalCost: number;
      fixedRatePerM3: number;
      breakdown: CalculationBreakdown;
    }> = {},
  ): CalculateReadingValueModel {
    const data = {
      cadastralKey,
      consumption: consumptionM3,
      waterConsumptionValue: 0,
      baseRate: 0,
      rateName: '',
      sewerageValue: 0,
      others: 0,
      additionalCost: 0,
      fixedRatePerM3: 0,
      ...overrides,
    };

    const rawTotal =
      Number(data.waterConsumptionValue) +
      Number(data.sewerageValue) +
      Number(data.others);

    const total = Math.max(0, Number(rawTotal.toFixed(2)));

    return new CalculateReadingValueModel({
      ...data,
      total,
    });
  }
}
