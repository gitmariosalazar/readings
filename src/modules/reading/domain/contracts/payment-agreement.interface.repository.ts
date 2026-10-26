import {
  ConceptAgreementPolicyModel,
  ConceptDeferralModel,
  PaymentAgreementInvoiceModel,
  PaymentAgreementModel,
} from '../schemas/model/payment-agreement.model';

export interface ZeroedConceptRecord {
  readingId: number;
  conceptId: number;
  conceptCode: string;
  originalAmount: number;
}

export interface ReadingConceptItemSQL {
  readingId: number;
  conceptId: number;
  conceptCode: string;
  amount: number;
}

export interface InterfacePaymentAgreementRepository {
  /**
   * Obtiene la matriz de políticas activas para conceptos en convenios.
   */
  findActivePolicies(): Promise<ConceptAgreementPolicyModel[]>;

  /**
   * Obtiene los conceptos facturados para un conjunto de lecturas.
   */
  findReadingConcepts(readingIds: number[]): Promise<ReadingConceptItemSQL[]>;

  /**
   * Crea el convenio, asocia las facturas, pone a cero los conceptos parametrizados
   * y encola los diferimientos en una transacción atómica.
   */
  createPaymentAgreement(
    agreement: PaymentAgreementModel,
    invoices: PaymentAgreementInvoiceModel[],
    zeroedConcepts: ZeroedConceptRecord[],
    deferrals: ConceptDeferralModel[],
  ): Promise<PaymentAgreementModel>;

  /**
   * Obtiene los diferimientos pendientes de cobro para una acometida.
   */
  findPendingDeferralsByConnection(
    connectionId: string,
  ): Promise<ConceptDeferralModel[]>;

  /**
   * Marca los diferimientos como aplicados en la lectura indicada.
   */
  markDeferralsAsApplied(
    deferralIds: number[],
    readingId: number,
  ): Promise<void>;
}
