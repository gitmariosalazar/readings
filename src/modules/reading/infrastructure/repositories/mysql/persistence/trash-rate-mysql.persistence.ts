import { Injectable, Logger } from '@nestjs/common';
import { InterfaceTrashRateRepository } from '../../../../domain/contracts/trash-rate.interface.repository';
import {
  EmelnorteCustomerDataModel,
  TrashRateAssignmentModel,
  TrashRateCategoryTariffModel,
} from '../../../../domain/schemas/model/trash-rate.model';
import { DatabaseAbstract } from '../../../../../../shared/connections/database/abstract/abstract.database';

@Injectable()
export class TrashRateMySQLPersistence implements InterfaceTrashRateRepository {
  private readonly logger = new Logger(TrashRateMySQLPersistence.name);

  constructor(private readonly databaseService: DatabaseAbstract) {}

  async findActiveAssignmentByConnection(
    _connectionId: string,
  ): Promise<TrashRateAssignmentModel | null> {
    return null;
  }

  async findActiveCategoryTariff(
    _categoryId: number,
    _versionSheet?: string,
  ): Promise<TrashRateCategoryTariffModel | null> {
    return null;
  }

  async saveAssignment(_assignment: TrashRateAssignmentModel): Promise<void> {
    return;
  }

  async saveBatchAssignments(
    _assignments: TrashRateAssignmentModel[],
  ): Promise<void> {
    return;
  }

  async getEmelnorteData(
    _clientId: string,
  ): Promise<EmelnorteCustomerDataModel | null> {
    return null;
  }

  async getActiveConnectionsByClientId(_clientId: string): Promise<string[]> {
    return [];
  }

  async findClientIdByConnectionId(
    _connectionId: string,
  ): Promise<string | null> {
    return null;
  }
}
