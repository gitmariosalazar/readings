import {
  TrashRateAssignmentModel,
  TrashRateCategoryTariffModel,
  EmelnorteCustomerDataModel,
} from '../schemas/model/trash-rate.model';

export interface InterfaceTrashRateRepository {
  /**
   * Busca la asignación fija activa de tasa de basura para una acometida.
   */
  findActiveAssignmentByConnection(
    connectionId: string,
  ): Promise<TrashRateAssignmentModel | null>;

  /**
   * Obtiene la tarifa y rangos vigentes para una categoría dentro de un pliego tarifario.
   */
  findActiveCategoryTariff(
    categoryId: number,
    versionSheet?: string,
  ): Promise<TrashRateCategoryTariffModel | null>;

  /**
   * Persiste una asignación fija de tasa de basura para una acometida.
   */
  saveAssignment(assignment: TrashRateAssignmentModel): Promise<void>;

  /**
   * Persiste un lote de asignaciones generadas por la distribución masiva.
   */
  saveBatchAssignments(
    assignments: TrashRateAssignmentModel[],
  ): Promise<void>;

  /**
   * Obtiene los datos históricos de EMELNORTE para una cédula/RUC.
   */
  getEmelnorteData(clientId: string): Promise<EmelnorteCustomerDataModel | null>;

  /**
   * Retorna las claves de acometidas activas (estado_id = 1) asociadas a un cliente.
   */
  getActiveConnectionsByClientId(clientId: string): Promise<string[]>;

  /**
   * Obtiene el identificador del cliente asociado a una acometida (por acometida_id o clave_catastral).
   */
  findClientIdByConnectionId?(connectionId: string): Promise<string | null>;
}
