import { Injectable } from '@nestjs/common';
import { InterfaceReadingRepository } from '../../../domain/contracts/reading.interface.repository';
import { BillingConceptValidity } from '../../../infrastructure/interfaces/sql/reading-sql.result.interface';

@Injectable()
export class GetBillingConceptValidityUseCase {
  constructor(private readonly readingRepository: InterfaceReadingRepository) {}

  async execute(): Promise<BillingConceptValidity[]> {
    return this.readingRepository.getBillingConceptValidity();
  }
}
