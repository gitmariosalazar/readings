import {
  IncidentDetailRowSQLResult,
  ReporterCompanySQLResult,
  ReporterPersonSQLResult,
  ReporterEmployeeSQLResult,
  ContactPhoneSQLResult,
  ContactEmailSQLResult,
  EvidencePhotoSQLResult,
  IncidentHistorySQLResult,
  UserRowSQLResult,
} from '../interfaces/sql/view_incidents.sql-result'; // Ajusta la ruta según tu estructura

import {
  IncidentDetailRowResponse,
  ReporterCompanyResponse,
  ReporterPersonResponse,
  ReporterEmployeeResponse,
  ContactPhoneResponse,
  ContactEmailResponse,
  EvidencePhotoResponse,
  IncidentHistoryResponse,
  UserRowResponse,
} from '../../domain/schemas/response/view_incident.response'; // Ajusta la ruta

export class IncidentAdapter {
  /**
   * Convierte una fila SQL a Response
   */
  static fromSQLResultToResponse(
    sql: IncidentDetailRowSQLResult,
  ): IncidentDetailRowResponse {
    return {
      incidentId: sql.incident_id,
      connectionId: sql.connection_id,
      incidentCode: sql.incident_code,

      readingId: sql.reading_id,

      // Categoría y Tipo
      categoryId: sql.category_id,
      categoryCode: sql.category_code,
      categoryName: sql.category_name,
      incidentTypeId: sql.incident_type_id,
      incidentTypeName: sql.incident_type_name,
      suggestedPriority: sql.suggested_priority,

      // Información del Reporte
      reportDescription: sql.report_description,
      referenceAddress: sql.reference_address,
      status: sql.status,
      reportOrigin: sql.report_origin,
      currentPriority: sql.current_priority,
      reportDate: sql.report_date,
      latitude: sql.latitude,
      longitude: sql.longitude,

      // Usuario que reporta
      reportedBy: IncidentAdapter.toUserRowResponse(sql.reported_by),
      company: sql.company
        ? IncidentAdapter.toReporterCompany(sql.company)
        : null,
      person: sql.person ? IncidentAdapter.toReporterPerson(sql.person) : null,

      // Resolución
      resolutionDate: sql.resolution_date,
      resolvedBy: sql.resolved_by
        ? IncidentAdapter.toUserRowResponse(sql.resolved_by)
        : null,
      resolutionDescription: sql.resolution_description,

      // Aspectos financieros
      chargeToUser: sql.charge_to_user,
      repairCost:
        typeof sql.repair_cost === 'string'
          ? Number(sql.repair_cost) || 0
          : sql.repair_cost,

      // Evidencias
      photosReport: (sql.photos_report || []).map((p) =>
        IncidentAdapter.toEvidencePhoto(p),
      ),
      photosReportCount:
        typeof sql.photos_report_count === 'string'
          ? Number(sql.photos_report_count)
          : sql.photos_report_count,

      photosResolution: (sql.photos_resolution || []).map((p) =>
        IncidentAdapter.toEvidencePhoto(p),
      ),
      photosResolutionCount:
        typeof sql.photos_resolution_count === 'string'
          ? Number(sql.photos_resolution_count)
          : sql.photos_resolution_count,

      // Historial
      historyRecent: (sql.history_recent || []).map((h) =>
        IncidentAdapter.toHistory(h),
      ),

      // Métricas de tiempo
      openDays: sql.open_days,
      pendingDays: sql.pending_days,

      // Auditoría
      createdAt: sql.created_at,
      updatedAt: sql.updated_at,
    };
  }

  /**
   * Convierte un array de filas SQL a array de Responses
   */
  static fromSQLResultListToResponseList(
    sqlRows: IncidentDetailRowSQLResult[],
  ): IncidentDetailRowResponse[] {
    return sqlRows.map((row) => IncidentAdapter.fromSQLResultToResponse(row));
  }

  /* ====================== Métodos Privados (Helpers) ====================== */

  private static toContactPhone(
    phone: ContactPhoneSQLResult,
  ): ContactPhoneResponse {
    return {
      telefonoId: phone.telefono_id,
      numero: phone.numero,
    };
  }

  private static toContactEmail(
    email: ContactEmailSQLResult,
  ): ContactEmailResponse {
    return {
      emailId: email.correo_electronico_id,
      correo: email.correo,
    };
  }

  private static toEvidencePhoto(
    photo: EvidencePhotoSQLResult,
  ): EvidencePhotoResponse {
    return {
      id: photo.id,
      filePath: photo.file_path,
      type: photo.type,
      createdAt: photo.created_at,
    };
  }

  private static toHistory(
    history: IncidentHistorySQLResult,
  ): IncidentHistoryResponse {
    return {
      dateChange: history.date_change,
      previousStatus: history.previous_status,
      newStatus: history.new_status,
      managedBy: history.managed_by,
      observation: history.observation,
    };
  }

  private static toUserRowResponse(user: UserRowSQLResult): UserRowResponse {
    return {
      name: user.name,
      cardId: user.card_id,
      userType: user.user_type,
      email: user.email,
      phone: user.phone,
    };
  }

  private static toReporterCompany(
    company: ReporterCompanySQLResult,
  ): ReporterCompanyResponse {
    return {
      companyId: company.company_id,
      commercialName: company.commercial_name,
      businessName: company.business_name,
      ruc: company.ruc,
      address: company.address,
      parishId: company.parish_id,
      country: company.country,
      clientId: company.client_id,
      phones: company.phones.map((p) => IncidentAdapter.toContactPhone(p)),
      emails: company.emails.map((e) => IncidentAdapter.toContactEmail(e)),
    };
  }

  private static toReporterPerson(
    person: ReporterPersonSQLResult,
  ): ReporterPersonResponse {
    return {
      personId: person.person_id,
      firstName: person.first_name,
      lastName: person.last_name,
      birthDate: person.birth_date,
      isDeceased: person.is_deceased,
      genderId: person.gender_id,
      civilStatusId: person.civil_status_id,
      professionId: person.profession_id,
      parishId: person.parish_id,
      address: person.address,
      country: person.country,
      phones: person.phones.map((p) => IncidentAdapter.toContactPhone(p)),
      emails: person.emails.map((e) => IncidentAdapter.toContactEmail(e)),
    };
  }

  private static toReporterEmployee(
    employee: ReporterEmployeeSQLResult,
  ): ReporterEmployeeResponse {
    return {
      employeeId: employee.employee_id,
      userId: employee.user_id,
      username: employee.username,
      firstName: employee.first_name,
      lastName: employee.last_name,
      email: employee.email,
    };
  }
}
