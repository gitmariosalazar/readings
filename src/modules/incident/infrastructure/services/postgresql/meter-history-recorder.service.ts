import { Injectable } from '@nestjs/common';
import { IDatabaseClient } from '../../../../../shared/connections/database/abstract/abstract.database';
import {
  IMeterHistoryRecorder,
  MeterReplacementContext,
} from '../meter-history-recorder.interface';

@Injectable()
export class MeterHistoryPostgresRecorder implements IMeterHistoryRecorder {
  async recordMeterReplacement(
    client: IDatabaseClient,
    context: MeterReplacementContext,
  ): Promise<void> {
    const { connectionId, changeDetail } = context;
    const newMeterNumber = changeDetail.medidor_nuevo?.numero_medidor?.trim();

    // Sin número de medidor nuevo no hay reemplazo físico que registrar
    if (!newMeterNumber) return;

    const previousMeterNumber =
      changeDetail.medidor_anterior?.numero_medidor?.trim() || 'SIN MEDIDOR';

    const clientRows = await client.query<{ cliente_id: string | null }>(
      `SELECT cliente_id FROM public.acometida WHERE acometida_id = ?`,
      [connectionId],
    );
    const clientId = clientRows[0]?.cliente_id ?? null;

    const now = new Date();
    const observation =
      changeDetail.observaciones?.trim() ||
      `Reemplazo de medidor ${previousMeterNumber} por ${newMeterNumber} reportado al resolver un incidente.`;

    await client.query(
      `UPDATE public.historial_medidores
         SET estado = 'INACTIVO', fecha_desinstalacion = ?, updated_at = ?
       WHERE id_acometida = ? AND estado = 'ACTIVO'`,
      [now, now, connectionId],
    );

    await client.query(
      `INSERT INTO public.historial_medidores (
         id_cliente, id_acometida, numero_medidor_anterior, numero_medidor_nuevo,
         fecha_instalacion, fecha_desinstalacion, estado, observacion, detalles_cambio,
         created_at, updated_at
       ) VALUES (?, ?, ?, ?, ?, NULL, 'ACTIVO', ?, ?::jsonb, ?, ?)`,
      [
        clientId,
        connectionId,
        previousMeterNumber,
        newMeterNumber,
        now,
        observation,
        JSON.stringify(changeDetail),
        now,
        now,
      ],
    );
  }
}
