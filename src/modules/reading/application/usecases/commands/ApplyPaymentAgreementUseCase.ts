import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InterfacePaymentAgreementRepository } from '../../../domain/contracts/payment-agreement.interface.repository';
import { ApplyPaymentAgreementRequest } from '../../dtos/request/apply-payment-agreement.request';
import {
  PaymentAgreementResponse,
  DeferredConceptSummaryResponse,
} from '../../dtos/response/payment-agreement.response';
import {
  ConceptAgreementPolicyModel,
  ConceptDeferralModel,
  PaymentAgreementInvoiceModel,
  PaymentAgreementModel,
} from '../../../domain/schemas/model/payment-agreement.model';
import { statusCode } from '../../../../../settings/environments/status-code';

@Injectable()
export class ApplyPaymentAgreementUseCase {
  constructor(
    @Inject('PaymentAgreementRepository')
    private readonly agreementRepository: InterfacePaymentAgreementRepository,
  ) {}

  async execute(
    request: ApplyPaymentAgreementRequest,
  ): Promise<PaymentAgreementResponse> {
    const errors = this.validate(request);
    if (errors.length > 0) {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: errors,
      });
    }

    const {
      agreementCode,
      connectionId,
      clientId,
      readingIds,
      numberOfInstallments,
      totalRefinancedAmount = 0,
      observation,
    } = request;

    // 1. Obtener políticas activas para conceptos en convenios (o usar política por defecto para ASEO)
    const activePolicies = await this.agreementRepository.findActivePolicies();
    const effectivePolicies =
      activePolicies && activePolicies.length > 0
        ? activePolicies
        : this.getDefaultPolicies();

    // 2. Obtener los conceptos existentes en las facturas/lecturas que entran a convenio
    const readingConcepts =
      await this.agreementRepository.findReadingConcepts(readingIds);

    // 3. Identificar qué conceptos deben ponerse a cero y cuáles se difieren
    const zeroedConcepts: {
      readingId: number;
      conceptId: number;
      conceptCode: string;
      originalAmount: number;
    }[] = [];

    // Agrupación de diferimientos acumulados por concepto
    const deferralsByConceptMap = new Map<
      number,
      {
        conceptId: number;
        conceptCode: string;
        accumulatedAmount: number;
        invoicesSet: Set<number>;
        policy: ConceptAgreementPolicyModel;
      }
    >();

    for (const rc of readingConcepts) {
      const policy = effectivePolicies.find(
        (p) =>
          p.conceptId === rc.conceptId ||
          p.conceptCode.toUpperCase() === rc.conceptCode.toUpperCase(),
      );

      if (policy && policy.actionOnInvoice === 'PONER_A_CERO' && rc.amount > 0) {
        zeroedConcepts.push({
          readingId: rc.readingId,
          conceptId: rc.conceptId,
          conceptCode: rc.conceptCode,
          originalAmount: rc.amount,
        });

        if (policy.remainingTreatment === 'DIFERIR_PROXIMA_FACTURA') {
          const existing = deferralsByConceptMap.get(rc.conceptId) || {
            conceptId: rc.conceptId,
            conceptCode: rc.conceptCode,
            accumulatedAmount: 0,
            invoicesSet: new Set<number>(),
            policy,
          };

          existing.accumulatedAmount += rc.amount;
          existing.invoicesSet.add(rc.readingId);
          deferralsByConceptMap.set(rc.conceptId, existing);
        }
      }
    }

    // 4. Crear modelos de diferimientos acumulados pendientes
    const deferralsToCreate: ConceptDeferralModel[] = [];
    const deferredSummary: DeferredConceptSummaryResponse[] = [];

    for (const [, item] of deferralsByConceptMap.entries()) {
      const roundedAmount = Number(item.accumulatedAmount.toFixed(2));
      const originCount = item.invoicesSet.size;

      if (roundedAmount > 0) {
        deferralsToCreate.push(
          new ConceptDeferralModel(
            connectionId,
            item.conceptId,
            roundedAmount,
            originCount,
            'PENDIENTE',
            null, // Se asigna al crear convenio
            item.conceptCode,
            null,
            undefined,
            new Date(),
            null,
            `Acumulado de ${originCount} factura(s) en convenio ${agreementCode}: $${roundedAmount.toFixed(
              2,
            )} diferido para la próxima factura.`,
          ),
        );

        deferredSummary.push({
          conceptId: item.conceptId,
          conceptCode: item.conceptCode,
          accumulatedAmount: roundedAmount,
          originInvoicesCount: originCount,
          treatment: item.policy.remainingTreatment,
        });
      }
    }

    // 5. Crear modelos de facturas asociadas
    const agreementInvoices: PaymentAgreementInvoiceModel[] = readingIds.map(
      (readingId) =>
        new PaymentAgreementInvoiceModel(readingId, 0, 0),
    );

    // 6. Cabecera del convenio
    const agreementModel = new PaymentAgreementModel(
      agreementCode,
      connectionId,
      clientId,
      numberOfInstallments,
      totalRefinancedAmount,
      'ACTIVO',
      new Date(),
      observation ?? null,
      agreementInvoices,
    );

    // 7. Persistir en repositorio mediante transacción atómica
    const savedAgreement =
      await this.agreementRepository.createPaymentAgreement(
        agreementModel,
        agreementInvoices,
        zeroedConcepts,
        deferralsToCreate,
      );

    return {
      agreementId: savedAgreement.id ?? 0,
      agreementCode: savedAgreement.agreementCode,
      connectionId: savedAgreement.connectionId,
      clientId: savedAgreement.clientId,
      numberOfInstallments: savedAgreement.numberOfInstallments,
      totalRefinancedAmount: savedAgreement.totalRefinancedAmount,
      status: savedAgreement.status,
      agreementDate: savedAgreement.agreementDate,
      affectedInvoicesCount: readingIds.length,
      deferredConcepts: deferredSummary,
      message: `Convenio ${agreementCode} aplicado exitosamente. ${zeroedConcepts.length} concepto(s) puestos a $0.00 en ${readingIds.length} factura(s). Saldo diferido encolado para cobro en el siguiente período regular.`,
    };
  }

  private validate(request: ApplyPaymentAgreementRequest): string[] {
    const errors: string[] = [];
    if (!request?.agreementCode || request.agreementCode.trim().length === 0) {
      errors.push('agreementCode es requerido');
    }
    if (!request?.connectionId || request.connectionId.trim().length === 0) {
      errors.push('connectionId es requerido');
    }
    if (!request?.clientId || request.clientId.trim().length === 0) {
      errors.push('clientId es requerido');
    }
    if (!Array.isArray(request?.readingIds) || request.readingIds.length === 0) {
      errors.push('readingIds debe ser un arreglo con al menos un id de lectura');
    }
    if (
      !Number.isInteger(Number(request?.numberOfInstallments)) ||
      Number(request?.numberOfInstallments) <= 0
    ) {
      errors.push('numberOfInstallments debe ser un entero mayor a cero');
    }
    return errors;
  }

  private getDefaultPolicies(): ConceptAgreementPolicyModel[] {
    return [
      new ConceptAgreementPolicyModel(
        3,
        'ASEO',
        'Diferimiento obligatorio de Tasa de Basura en Convenios',
        'PONER_A_CERO',
        'DIFERIR_PROXIMA_FACTURA',
        100.0,
        true,
      ),
    ];
  }
}
