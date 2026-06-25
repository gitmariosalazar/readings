import { UUID } from 'crypto';
import {
  IncidentCategorySQLResult,
  IncidentSQLResult,
} from '../interfaces/sql/incident-sql.result.interface';
import { IncidentModel } from '../../domain/schemas/model/incident.model';
import { IncidentCategoryModel, IncidentTypeModel } from '../../domain/schemas/model/incident-category-type.model';
import { IncidentCategoryResponse } from '../../application/dtos/response/incident-category-type.response';

/**
 * Adapter to map database query results into the domain model.
 */
export class IncidentSQLAdapter {
  static fromSQLResultToModel(result: IncidentSQLResult): IncidentModel {
    const lat =
      result.latitude !== null && result.latitude !== undefined
        ? Number(result.latitude)
        : null;
    const lng =
      result.longitude !== null && result.longitude !== undefined
        ? Number(result.longitude)
        : null;
    const coords = lat !== null && lng !== null ? { lat, lng } : null;

    return new IncidentModel(
      result.incident_id,
      result.acometida_id,
      result.lectura_id,
      result.tipo_incidente_id,
      result.descripcion_reporte,
      result.direccion_referencia,
      result.estado,
      result.origen_reporte,
      result.prioridad,
      result.fecha_reporte,
      result.usuario_reporta_id ? (result.usuario_reporta_id as UUID) : null,
      result.cliente_usuario_reporta_id
        ? (result.cliente_usuario_reporta_id as UUID)
        : null,
      coords,
      result.fecha_resolucion,
      result.usuario_resuelve_id ? (result.usuario_resuelve_id as UUID) : null,
      result.descripcion_resolucion,
      result.cobrar_a_usuario,
      parseFloat(result.costo_reparacion || '0.00'),
      result.categoryName,
      result.categoryCode,
      result.incidentTypeName,
      result.suggestedPriority,
      result.reportedBy,
      result.evidencePhotos,
      result.statusHistory,
    );
  }

  static fromIncidentCategorySQLResultToResponse(
    result: IncidentCategorySQLResult,
  ): IncidentCategoryModel {
    const model = new IncidentCategoryModel();
    model.categoryId = result.category_id;
    model.categoryCode = result.category_code;
    model.categoryName = result.category_name;
    model.categoryDescription = result.category_description;
    model.incidentTypes = result.incident_types.map((type) => ({
      typeCode: type.type_code,
      typeName: type.type_name,
      typeDescription: type.type_description,
      suggestedPriority: type.suggested_priority,
    }));
    return model;
  }

  static fromIncidentCategorySQLResultToResponseDTO(
    result: IncidentCategorySQLResult,
  ): IncidentCategoryResponse {
    return {
      categoryId: result.category_id,
      categoryCode: result.category_code,
      categoryName: result.category_name,
      categoryDescription: result.category_description,
      incidentTypes: result.incident_types.map((type) => ({
        typeCode: type.type_code,
        typeName: type.type_name,
        typeDescription: type.type_description,
        suggestedPriority: type.suggested_priority,
      })),
    };
  }
}
