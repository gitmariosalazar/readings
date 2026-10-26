export class ApplyPaymentAgreementRequest {
  agreementCode!: string; // ej. 'CONV-2026-0001'
  connectionId!: string; // Clave catastral o ID de acometida
  clientId!: string; // Cédula o RUC
  readingIds!: number[]; // IDs de las facturas/lecturas que entran al convenio
  numberOfInstallments!: number; // Número de cuotas pactadas (> 0)
  totalRefinancedAmount?: number; // Monto total refinanciado
  observation?: string;
}
