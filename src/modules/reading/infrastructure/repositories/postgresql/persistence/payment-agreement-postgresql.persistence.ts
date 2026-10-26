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
export class PaymentAgreementPostgreSQLPersistence
  implements InterfacePaymentAgreementRepository
{
  private readonly logger = new Logger(
    PaymentAgreementPostgreSQLPersistence.name,
  );

  constructor(private readonly databaseService: DatabaseAbstract) {}

  async findActivePolicies(): Promise<ConceptAgreementPolicyModel[]> {
    try {
      const query = /*sql*/ `
        SELECT 
            pcc.id_politica_convenio AS "id",
            pcc.concepto_id AS "conceptId",
            cc.codigo AS "conceptCode",
            pcc.nombre_politica AS "policyName",
            pcc.accion_en_factura AS "actionOnInvoice",
            pcc.tratamiento_saldo AS "remainingTreatment",
            pcc.porcentaje_accion AS "actionPercentage",
            pcc.activo AS "isActive"
        FROM politica_convenio_concepto pcc
        JOIN concepto_cobro cc ON cc.id_concepto = pcc.concepto_id
        WHERE pcc.activo IS TRUE;
      `;
      const rows = await this.databaseService.query<any>(query, []);
      return (rows || []).map(
        (r) =>
          new ConceptAgreementPolicyModel(
            Number(r.conceptId),
            r.conceptCode,
            r.policyName,
            r.actionOnInvoice,
            r.remainingTreatment,
            Number(r.actionPercentage ?? 100),
            Boolean(r.isActive),
            Number(r.id),
          ),
      );
    } catch (error: any) {
      if (error?.code === '42P01') {
        return [];
      }
      this.logger.warn(
        `Error consultando políticas de convenio: ${error?.message || error}`,
      );
      return [];
    }
  }

  async findReadingConcepts(
    readingIds: number[],
  ): Promise<ReadingConceptItemSQL[]> {
    if (!readingIds || readingIds.length === 0) {
      return [];
    }
    try {
      const query = /*sql*/ `
        SELECT 
            dcl.lectura_id AS "readingId",
            dcl.concepto_id AS "conceptId",
            cc.codigo AS "conceptCode",
            dcl.valor AS "amount"
        FROM detalle_concepto_lectura dcl
        JOIN concepto_cobro cc ON cc.id_concepto = dcl.concepto_id
        WHERE dcl.lectura_id = ANY($1::int[]);
      `;
      const rows = await this.databaseService.query<any>(query, [readingIds]);
      return (rows || []).map((r) => ({
        readingId: Number(r.readingId),
        conceptId: Number(r.conceptId),
        conceptCode: r.conceptCode,
        amount: Number(r.amount),
      }));
    } catch (error: any) {
      this.logger.error('Error consultando conceptos de lecturas:', error);
      throw error;
    }
  }

  async createPaymentAgreement(
    agreement: PaymentAgreementModel,
    invoices: PaymentAgreementInvoiceModel[],
    zeroedConcepts: ZeroedConceptRecord[],
    deferrals: ConceptDeferralModel[],
  ): Promise<PaymentAgreementModel> {
    try {
      // 1. Insertar cabecera de convenio
      const agreementQuery = /*sql*/ `
        INSERT INTO convenio_pago (
            codigo_convenio,
            acometida_id,
            cliente_id,
            numero_cuotas,
            monto_total_refinanciado,
            estado,
            fecha_acuerdo,
            observacion
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id_convenio_pago AS "id";
      `;
      const agreementRows = await this.databaseService.query<any>(
        agreementQuery,
        [
          agreement.agreementCode,
          agreement.connectionId,
          agreement.clientId,
          agreement.numberOfInstallments,
          agreement.totalRefinancedAmount,
          agreement.status,
          agreement.agreementDate ?? new Date(),
          agreement.observation ?? null,
        ],
      );
      const agreementId = Number(agreementRows[0]?.id);

      // 2. Asociar facturas
      for (const inv of invoices) {
        const invQuery = /*sql*/ `
          INSERT INTO convenio_factura (
              convenio_id,
              lectura_id,
              monto_original_factura,
              monto_refinanciado
          ) VALUES ($1, $2, $3, $4)
          ON CONFLICT (convenio_id, lectura_id) DO NOTHING;
        `;
        await this.databaseService.query(invQuery, [
          agreementId,
          inv.readingId,
          inv.originalInvoiceAmount ?? 0,
          inv.refinancedAmount ?? 0,
        ]);
      }

      // 3. Poner a cero los conceptos en las facturas involucradas
      for (const zc of zeroedConcepts) {
        const zeroQuery = /*sql*/ `
          UPDATE detalle_concepto_lectura
          SET valor = 0.00,
              formula = FORMAT('Excluido por Convenio %s (Valor previo: $%s)', $3::text, valor::text)
          WHERE lectura_id = $1 AND concepto_id = $2;
        `;
        await this.databaseService.query(zeroQuery, [
          zc.readingId,
          zc.conceptId,
          agreement.agreementCode,
        ]);
      }

      // 4. Encolar los saldos diferidos pendientes
      for (const def of deferrals) {
        const defQuery = /*sql*/ `
          INSERT INTO concepto_diferido_pendiente (
              acometida_id,
              concepto_id,
              convenio_id,
              monto_acumulado,
              cantidad_facturas_origen,
              estado,
              fecha_registro,
              observacion
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
        `;
        await this.databaseService.query(defQuery, [
          def.connectionId,
          def.conceptId,
          agreementId,
          def.accumulatedAmount,
          def.originInvoicesCount,
          def.status,
          def.registrationDate ?? new Date(),
          def.observation ?? null,
        ]);
      }

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
        agreementId,
      );
    } catch (error: any) {
      this.logger.error(
        `Error creando convenio de pago ${agreement.agreementCode}:`,
        error,
      );
      throw error;
    }
  }

  async findPendingDeferralsByConnection(
    connectionId: string,
  ): Promise<ConceptDeferralModel[]> {
    try {
      const query = /*sql*/ `
        SELECT 
            cdp.id_concepto_diferido AS "id",
            cdp.acometida_id AS "connectionId",
            cdp.concepto_id AS "conceptId",
            cc.codigo AS "conceptCode",
            cdp.convenio_id AS "agreementId",
            cdp.monto_acumulado AS "accumulatedAmount",
            cdp.cantidad_facturas_origen AS "originInvoicesCount",
            cdp.estado AS "status",
            cdp.fecha_registro AS "registrationDate",
            cdp.observacion AS "observation"
        FROM concepto_diferido_pendiente cdp
        JOIN concepto_cobro cc ON cc.id_concepto = cdp.concepto_id
        WHERE (cdp.acometida_id = $1 OR EXISTS (SELECT 1 FROM acometida a WHERE a.clave_catastral = $1 AND a.acometida_id = cdp.acometida_id))
          AND cdp.estado = 'PENDIENTE';
      `;
      const rows = await this.databaseService.query<any>(query, [connectionId]);
      return (rows || []).map(
        (r) =>
          new ConceptDeferralModel(
            r.connectionId,
            Number(r.conceptId),
            Number(r.accumulatedAmount),
            Number(r.originInvoicesCount),
            r.status,
            r.agreementId ? Number(r.agreementId) : null,
            r.conceptCode,
            null,
            Number(r.id),
            r.registrationDate ? new Date(r.registrationDate) : new Date(),
            null,
            r.observation ?? null,
          ),
      );
    } catch (error: any) {
      if (error?.code === '42P01') {
        return [];
      }
      this.logger.warn(
        `Error consultando diferimientos para acometida "${connectionId}": ${error?.message || error}`,
      );
      return [];
    }
  }

  async markDeferralsAsApplied(
    deferralIds: number[],
    readingId: number,
  ): Promise<void> {
    if (!deferralIds || deferralIds.length === 0) {
      return;
    }
    try {
      const query = /*sql*/ `
        UPDATE concepto_diferido_pendiente
        SET estado = 'APLICADO',
            lectura_id_aplicada = $1,
            fecha_application = NOW()
        WHERE id_concepto_diferido = ANY($2::bigint[]);
      `;
      await this.databaseService.query(query, [readingId, deferralIds]);
    } catch (error: any) {
      if (error?.code === '42P01') {
        return;
      }
      this.logger.warn(
        `Error marcando diferimientos como aplicados en lectura ${readingId}: ${error?.message || error}`,
      );
    }
  }
}
