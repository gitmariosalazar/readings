import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InterfaceReadingBillingBreakdownRepository } from '../../../domain/contracts/reading-billing-breakdown.interface.repository';
import { RegisterReadingBillingBreakdownRequest } from '../../dtos/request/register-reading-billing-breakdown.request';
import { ReadingBillingBreakdownMapper } from '../../mappers/reading-billing-breakdown.mapper';
import { statusCode } from '../../../../../settings/environments/status-code';

@Injectable()
export class RegisterReadingBillingBreakdownUseCase {
  constructor(
    @Inject('ReadingBillingBreakdownRepository')
    private readonly breakdownRepository: InterfaceReadingBillingBreakdownRepository,
  ) {}

  async execute(
    request: RegisterReadingBillingBreakdownRequest,
  ): Promise<void> {
    const errors = this.validate(request);
    if (errors.length > 0) {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: errors,
      });
    }

    const conceptDetails = request.conceptDetails.map((d) =>
      ReadingBillingBreakdownMapper.fromConceptDetailRequestToModel(d),
    );
    const waterCalculation =
      ReadingBillingBreakdownMapper.fromWaterCalculationRequestToModel(
        request.waterCalculation,
      );

    await this.breakdownRepository.saveBillingBreakdown(
      conceptDetails,
      waterCalculation,
    );
  }

  private validate(request: RegisterReadingBillingBreakdownRequest): string[] {
    const errors: string[] = [];
    const water = request?.waterCalculation;
    const details = request?.conceptDetails;

    if (!water) {
      return ['waterCalculation es requerido'];
    }
    if (!Array.isArray(details)) {
      return ['conceptDetails debe ser un arreglo'];
    }

    const isPositiveInt = (v: unknown) =>
      Number.isInteger(Number(v)) && Number(v) > 0;
    const isAmount = (v: unknown) =>
      v !== null && v !== '' && Number.isFinite(Number(v)) && Number(v) >= 0;
    const isOptionalNumber = (v: unknown) =>
      v === null || v === undefined || Number.isFinite(Number(v));

    if (!isPositiveInt(water.readingId)) {
      errors.push('waterCalculation.readingId debe ser un entero positivo');
    }
    if (!isPositiveInt(water.categoryId)) {
      errors.push('waterCalculation.categoryId debe ser un entero positivo');
    }
    if (!isAmount(water.waterAmount)) {
      errors.push(
        'waterCalculation.waterAmount debe ser un número no negativo',
      );
    }
    const optionalWaterFields = [
      'minRange',
      'maxRange',
      'appliedBase',
      'additionalRatePerM3',
      'additionalM3',
    ] as const;
    for (const field of optionalWaterFields) {
      if (!isOptionalNumber(water[field])) {
        errors.push(`waterCalculation.${field} debe ser numérico o nulo`);
      }
    }

    details.forEach((d, i) => {
      if (!isPositiveInt(d.readingId)) {
        errors.push(
          `conceptDetails[${i}].readingId debe ser un entero positivo`,
        );
      } else if (Number(d.readingId) !== Number(water.readingId)) {
        errors.push(
          `conceptDetails[${i}].readingId debe coincidir con waterCalculation.readingId`,
        );
      }
      if (!isPositiveInt(d.conceptId)) {
        errors.push(
          `conceptDetails[${i}].conceptId debe ser un entero positivo`,
        );
      }
      if (!isAmount(d.amount)) {
        errors.push(
          `conceptDetails[${i}].amount debe ser un número no negativo`,
        );
      }
      if (!isOptionalNumber(d.calculationBase)) {
        errors.push(
          `conceptDetails[${i}].calculationBase debe ser numérico o nulo`,
        );
      }
    });

    return errors;
  }
}
