import { IDatabaseClient } from '../../../../shared/connections/database/abstract/abstract.database';
import { IncidentChangeDetail } from '../../application/dtos/request/resolve-incident.request';

export interface MeterReplacementContext {
  connectionId: string;
  changeDetail: IncidentChangeDetail;
}

/**
 * Registra en historial_medidores el reemplazo físico de un medidor reportado
 * al resolver un incidente (mismo patrón usado por el microservicio connection,
 * que a su vez reemplazó al trigger fn_registrar_historial_medidor).
 */
export interface IMeterHistoryRecorder {
  recordMeterReplacement(
    client: IDatabaseClient,
    context: MeterReplacementContext,
  ): Promise<void>;
}
