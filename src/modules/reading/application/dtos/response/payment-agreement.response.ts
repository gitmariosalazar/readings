export interface DeferredConceptSummaryResponse {
  conceptId: number;
  conceptCode: string;
  accumulatedAmount: number;
  originInvoicesCount: number;
  treatment: string;
}

export class PaymentAgreementResponse {
  agreementId!: number;
  agreementCode!: string;
  connectionId!: string;
  clientId!: string;
  numberOfInstallments!: number;
  totalRefinancedAmount!: number;
  status!: string;
  agreementDate!: Date;
  affectedInvoicesCount!: number;
  deferredConcepts!: DeferredConceptSummaryResponse[];
  message!: string;
}
