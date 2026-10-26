import { Injectable, Logger } from '@nestjs/common';
import {
  InterfacePaymentAgreementRepository,
  ReadingConceptItemSQL,
  ZeroedConceptRecord,
} from '../../../../domain/contracts/payment-agreement.interface.repository';
import {
  ConceptAgreementPolicyModel,
  ConceptDeferralModel,
  PaymentAgreementInvoiceModel,
  PaymentAgreementModel,
} from '../../../../domain/schemas/model/payment-agreement.model';
import { DatabaseAbstract } from '../../../../../../shared/connections/database/abstract/abstract.database';

@Injectable()
export class PaymentAgreementMySQLPersistence
  implements InterfacePaymentAgreementRepository
{
  private readonly logger = new Logger(PaymentAgreementMySQLPersistence.name);

  constructor(private readonly databaseService: DatabaseAbstract) {}

  async findActivePolicies(): Promise<ConceptAgreementPolicyModel[]> {
    return [];
  }

  async findReadingConcepts(
    _readingIds: number[],
  ): Promise<ReadingConceptItemSQL[]> {
    return [];
  }

  async createPaymentAgreement(
    agreement: PaymentAgreementModel,
    invoices: PaymentAgreementInvoiceModel[],
    _zeroedConcepts: ZeroedConceptRecord[],
    _deferrals: ConceptDeferralModel[],
  ): Promise<PaymentAgreementModel> {
    return agreement;
  }

  async findPendingDeferralsByConnection(
    _connectionId: string,
  ): Promise<ConceptDeferralModel[]> {
    return [];
  }

  async markDeferralsAsApplied(
    _deferralIds: number[],
    _readingId: number,
  ): Promise<void> {
    return;
  }
}
