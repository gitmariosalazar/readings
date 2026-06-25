import { UUID } from 'crypto';
import { CreateIncidentRequest } from '../dtos/request/create-incident.request';
import { IncidentResponse } from '../dtos/response/incident.response';
import { IncidentModel } from '../../domain/schemas/model/incident.model';
import { IncidentCategoryModel } from '../../domain/schemas/model/incident-category-type.model';
import { IncidentCategoryResponse } from '../dtos/response/incident-category-type.response';

export class IncidentMapper {
  static fromCreateRequestToModel(
    request: CreateIncidentRequest,
    reporterUserId: UUID | null,
    clienteUsuarioReportaId: UUID | null,
  ): IncidentModel {
    const lat = request.latitude ?? null;
    const lng = request.longitude ?? null;
    const coords = lat !== null && lng !== null ? { lat, lng } : null;

    return new IncidentModel(
      0, // ID will be assigned by database
      request.connectionId ?? null,
      request.readingId ?? null,
      request.incidentTypeId,
      request.reportDescription,
      request.referenceAddress ?? null,
      'REPORTADO', // Default status
      request.reportOrigin,
      request.priority ?? 'MEDIA', // Default priority
      new Date(),
      reporterUserId,
      clienteUsuarioReportaId,
      coords,
      null,
      null,
      null,
      false, // chargeToUser default
      0.0, // repairCost default
    );
  }

  static fromModelToResponse(model: IncidentModel): IncidentResponse {
    return {
      incidentId: model.id,
      connectionId: model.connectionId,
      readingId: model.readingId,
      incidentTypeId: model.incidentTypeId,
      reportDescription: model.reportDescription,
      referenceAddress: model.referenceAddress,
      status: model.status,
      reportOrigin: model.reportOrigin,
      priority: model.priority,
      reportDate: model.reportDate,
      reporterUserId: model.reporterUserId,
      clienteUsuarioReportaId: model.clienteUsuarioReportaId,
      latitude: model.coordinates?.lat ?? null,
      longitude: model.coordinates?.lng ?? null,
      resolutionDate: model.resolutionDate,
      resolverUserId: model.resolverUserId,
      resolutionDescription: model.resolutionDescription,
      chargeToUser: model.chargeToUser,
      repairCost: model.repairCost,
      categoryName: model.categoryName,
      categoryCode: model.categoryCode,
      incidentTypeName: model.incidentTypeName,
      suggestedPriority: model.suggestedPriority,
      reportedBy: model.reportedBy,
      evidencePhotos: model.evidencePhotos,
      statusHistory: model.statusHistory,
    };
  }

  static fromIncidentCategoryModelsToResponses(
    models: IncidentCategoryModel[],
  ): IncidentCategoryResponse[] {
    return models.map((model) => ({
      categoryId: model.categoryId,
      categoryCode: model.categoryCode,
      categoryName: model.categoryName,
      categoryDescription: model.categoryDescription,
      incidentTypes: model.incidentTypes.map((type) => ({
        typeCode: type.typeCode,
        typeName: type.typeName,
        typeDescription: type.typeDescription,
        suggestedPriority: type.suggestedPriority,
      })),
    }));
  }
}
