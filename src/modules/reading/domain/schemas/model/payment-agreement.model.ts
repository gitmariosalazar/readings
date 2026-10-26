export type AgreementStatus = 'ACTIVO' | 'FINALIZADO' | 'ANULADO';

export type ConceptAgreementAction =
  | 'PONER_A_CERO'
  | 'MANTENER_VALOR'
  | 'DESCUENTO_PORCENTAJE';

export type ConceptRemainingTreatment =
  | 'DIFERIR_PROXIMA_FACTURA'
  | 'EXONERAR_DEFINITIVO'
  | 'FINANCIAR_EN_CONVENIO';

export type DeferralStatus = 'PENDIENTE' | 'APLICADO' | 'ANULADO';

/**
 * Matriz paramétrica de políticas por concepto al suscribir un convenio.
 */
export class ConceptAgreementPolicyModel {
  constructor(
    public readonly conceptId: number,
    public readonly conceptCode: string,
    public readonly policyName: string,
    public readonly actionOnInvoice: ConceptAgreementAction = 'PONER_A_CERO',
    public readonly remainingTreatment: ConceptRemainingTreatment = 'DIFERIR_PROXIMA_FACTURA',
    public readonly actionPercentage: number = 100.0,
    public readonly isActive: boolean = true,
    public readonly id?: number,
  ) {}
}

/**
 * Registro de saldo diferido pendiente de cobro en la siguiente factura.
 */
export class ConceptDeferralModel {
  constructor(
    public readonly connectionId: string,
    public readonly conceptId: number,
    public readonly accumulatedAmount: number,
    public readonly originInvoicesCount: number = 1,
    public readonly status: DeferralStatus = 'PENDIENTE',
    public readonly agreementId?: number | null,
    public readonly conceptCode?: string | null,
    public readonly appliedReadingId?: number | null,
    public readonly id?: number,
    public readonly registrationDate: Date = new Date(),
    public readonly applicationDate?: Date | null,
    public readonly observation?: string | null,
  ) {}
}

/**
 * Factura / Lectura asociada a un convenio de pago.
 */
export class PaymentAgreementInvoiceModel {
  constructor(
    public readonly readingId: number,
    public readonly originalInvoiceAmount: number,
    public readonly refinancedAmount: number,
    public readonly agreementId?: number,
    public readonly id?: number,
  ) {}
}

/**
 * Cabecera del convenio de pago.
 */
export class PaymentAgreementModel {
  constructor(
    public readonly agreementCode: string,
    public readonly connectionId: string,
    public readonly clientId: string,
    public readonly numberOfInstallments: number,
    public readonly totalRefinancedAmount: number,
    public readonly status: AgreementStatus = 'ACTIVO',
    public readonly agreementDate: Date = new Date(),
    public readonly observation?: string | null,
    public readonly invoices: PaymentAgreementInvoiceModel[] = [],
    public readonly id?: number,
  ) {}
}
