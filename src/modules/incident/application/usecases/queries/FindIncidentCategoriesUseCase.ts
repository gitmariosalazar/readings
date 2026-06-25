import { Inject, Injectable } from '@nestjs/common';
import { InterfaceIncidentRepository } from '../../../domain/contracts/incident.interface.repository';
import { IncidentMapper } from '../../mappers/incident.mapper';
import { IncidentCategoryResponse } from '../../dtos/response/incident-category-type.response';

@Injectable()
/**
 * Use case to find all incident categories.
 */
export class FindIncidentCategoriesUseCase {
  constructor(
    @Inject('IncidentRepository')
    private readonly incidentRepository: InterfaceIncidentRepository,
  ) {}

  async execute(): Promise<IncidentCategoryResponse[]> {
    try {
      const models = await this.incidentRepository.findIncidentCategories();
      return IncidentMapper.fromIncidentCategoryModelsToResponses(models);
    } catch (error) {
      throw error;
    }
  }
}
