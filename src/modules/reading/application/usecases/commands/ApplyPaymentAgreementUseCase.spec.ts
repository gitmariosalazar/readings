import { ApplyPaymentAgreementUseCase } from './ApplyPaymentAgreementUseCase';
import { InterfacePaymentAgreementRepository } from '../../../domain/contracts/payment-agreement.interface.repository';
import { ApplyPaymentAgreementRequest } from '../../dtos/request/apply-payment-agreement.request';
import {
  ConceptAgreementPolicyModel,
  PaymentAgreementModel,
} from '../../../domain/schemas/model/payment-agreement.model';
import { RpcException } from '@nestjs/microservices';

describe('ApplyPaymentAgreementUseCase (Convenio de Pago y Puesta a Cero de Conceptos)', () => {
  let useCase: ApplyPaymentAgreementUseCase;
  let mockRepository: jest.Mocked<InterfacePaymentAgreementRepository>;

  beforeEach(() => {
    mockRepository = {
      findActivePolicies: jest.fn(),
      findReadingConcepts: jest.fn(),
      createPaymentAgreement: jest.fn(),
      findPendingDeferralsByConnection: jest.fn(),
      markDeferralsAsApplied: jest.fn(),
    };

    useCase = new ApplyPaymentAgreementUseCase(mockRepository);
  });

  it('throws RpcException when input validation fails (e.g. empty readingIds)', async () => {
    const invalidRequest = new ApplyPaymentAgreementRequest();
    invalidRequest.agreementCode = 'CONV-1';
    invalidRequest.connectionId = '22-492';
    invalidRequest.clientId = '0200236479001';
    invalidRequest.readingIds = []; // vacío
    invalidRequest.numberOfInstallments = 6;

    await expect(useCase.execute(invalidRequest)).rejects.toThrow(RpcException);
  });

  it('puts ASEO to $0.00 in 3 readings and enqueues accumulated deferral of $39.39 for the next month', async () => {
    // 3 lecturas/facturas pasadas: 101, 102, 103, cada una con ASEO = $13.13
    const request: ApplyPaymentAgreementRequest = {
      agreementCode: 'CONV-2026-0001',
      connectionId: '22-492',
      clientId: '0200236479001',
      readingIds: [101, 102, 103],
      numberOfInstallments: 6,
      totalRefinancedAmount: 150.0,
      observation: 'Convenio 3 facturas vencidas',
    };

    mockRepository.findActivePolicies.mockResolvedValueOnce([
      new ConceptAgreementPolicyModel(
        3,
        'ASEO',
        'Diferimiento de Basura en Convenio',
        'PONER_A_CERO',
        'DIFERIR_PROXIMA_FACTURA',
      ),
    ]);

    mockRepository.findReadingConcepts.mockResolvedValueOnce([
      { readingId: 101, conceptId: 3, conceptCode: 'ASEO', amount: 13.13 },
      { readingId: 101, conceptId: 1, conceptCode: 'AGUA', amount: 20.0 },
      { readingId: 102, conceptId: 3, conceptCode: 'ASEO', amount: 13.13 },
      { readingId: 102, conceptId: 1, conceptCode: 'AGUA', amount: 20.0 },
      { readingId: 103, conceptId: 3, conceptCode: 'ASEO', amount: 13.13 },
      { readingId: 103, conceptId: 1, conceptCode: 'AGUA', amount: 20.0 },
    ]);

    mockRepository.createPaymentAgreement.mockImplementationOnce(
      async (agreement, invoices, _zeroed, _deferrals) => {
        return new PaymentAgreementModel(
          agreement.agreementCode,
          agreement.connectionId,
          agreement.clientId,
          agreement.numberOfInstallments,
          agreement.totalRefinancedAmount,
          agreement.status,
          agreement.agreementDate,
          agreement.observation,
          invoices,
          999, // agreementId generado
        );
      },
    );

    const response = await useCase.execute(request);

    expect(response.agreementId).toBe(999);
    expect(response.agreementCode).toBe('CONV-2026-0001');
    expect(response.affectedInvoicesCount).toBe(3);

    // Verificación del diferimiento encolado
    expect(response.deferredConcepts).toHaveLength(1);
    expect(response.deferredConcepts[0].conceptCode).toBe('ASEO');
    expect(response.deferredConcepts[0].accumulatedAmount).toBe(39.39);
    expect(response.deferredConcepts[0].originInvoicesCount).toBe(3);
    expect(response.deferredConcepts[0].treatment).toBe('DIFERIR_PROXIMA_FACTURA');

    // Verificar parámetros enviados a createPaymentAgreement
    expect(mockRepository.createPaymentAgreement).toHaveBeenCalledTimes(1);
    const [, , zeroedConcepts, deferrals] =
      mockRepository.createPaymentAgreement.mock.calls[0];

    // 3 conceptos ASEO puestos a cero
    expect(zeroedConcepts).toHaveLength(3);
    expect(zeroedConcepts[0]).toEqual({
      readingId: 101,
      conceptId: 3,
      conceptCode: 'ASEO',
      originalAmount: 13.13,
    });

    // 1 registro de saldo diferido encolado para la acometida 22-492
    expect(deferrals).toHaveLength(1);
    expect(deferrals[0].connectionId).toBe('22-492');
    expect(deferrals[0].conceptId).toBe(3);
    expect(deferrals[0].accumulatedAmount).toBe(39.39);
    expect(deferrals[0].status).toBe('PENDIENTE');
  });

  it('demonstrates scalability by handling an additional concept with EXONERAR_DEFINITIVO without deferral', async () => {
    const request: ApplyPaymentAgreementRequest = {
      agreementCode: 'CONV-2026-0002',
      connectionId: '22-492',
      clientId: '0200236479001',
      readingIds: [201],
      numberOfInstallments: 3,
    };

    mockRepository.findActivePolicies.mockResolvedValueOnce([
      new ConceptAgreementPolicyModel(
        9,
        'COMERCIALIZACION',
        'Exoneración definitiva de Comercialización',
        'PONER_A_CERO',
        'EXONERAR_DEFINITIVO',
      ),
    ]);

    mockRepository.findReadingConcepts.mockResolvedValueOnce([
      { readingId: 201, conceptId: 9, conceptCode: 'COMERCIALIZACION', amount: 1.0 },
    ]);

    mockRepository.createPaymentAgreement.mockImplementationOnce(
      async (agreement, invoices) =>
        new PaymentAgreementModel(
          agreement.agreementCode,
          agreement.connectionId,
          agreement.clientId,
          agreement.numberOfInstallments,
          agreement.totalRefinancedAmount,
          agreement.status,
          agreement.agreementDate,
          agreement.observation,
          invoices,
          1001,
        ),
    );

    const response = await useCase.execute(request);
    // Puesto a cero en la factura pero no se encola diferimiento porque se exonera definitivamente
    expect(response.deferredConcepts).toHaveLength(0);

    const [, , zeroedConcepts, deferrals] =
      mockRepository.createPaymentAgreement.mock.calls[0];
    expect(zeroedConcepts).toHaveLength(1);
    expect(zeroedConcepts[0].conceptCode).toBe('COMERCIALIZACION');
    expect(deferrals).toHaveLength(0);
  });
});
