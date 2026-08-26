import {
  emails,
  phones,
  ReadingBasicInfoResponse,
  ReadingInfoResponse,
} from '../../application/dtos/response/reading-basic.response';
import {
  ReadingModel,
  ReadingNoveltyModel,
} from '../../domain/schemas/model/reading.model';
import { ReadingBasicInfoModel } from '../../domain/schemas/model/reading-basic-info.model';
import {
  ReadingInfoModel,
  ClientPhoneModel,
  ClientEmailModel,
  ReadingDetailedModel,
} from '../../domain/schemas/model/reading-info.model';
import { ReadingResponse } from '../../application/dtos/response/reading.response';
import {
  AdvancedReportReadingsSQLResult,
  ClientEmailSQLResult,
  ClientPhoneSQLResult,
  MonthlySummarySQLResult,
  PendingReadingConnectionSQLResult,
  ReadingBasicInfoSQLResult,
  ReadingDetailedSQLResult,
  ReadingHistorySQLResult,
  ReadingImagesSQLResult,
  ReadingInfoSQLResult,
  ReadingNoveltySQLResult,
  ReadingSQLResult,
  TakenReadingConnectionSQLResult,
} from '../interfaces/sql/reading-sql.result.interface';
import { AdvancedReportReadingsModel } from '../../domain/schemas/model/report/advanced-report-readings.model';
import { ReadingHistoryModel } from '../../domain/schemas/model/reading-history.model';
import { ReadingImagesResponse } from '../../application/dtos/response/reading-images.response';
import { number, string } from 'joi';
import { TakenReadingConnectionModel } from '../../domain/schemas/model/taken-reading-connection.model';
import { PendingReadingConnectionModel } from '../../domain/schemas/model/pending-reading-connection.model';
import { MonthlySummaryModel } from '../../domain/schemas/model/report/monthly-summary.model';
import { ReadingImagesModel } from '../../domain/schemas/model/reading-images.model';

export class ReadingSQLAdapter {
  static fromReadingPostgreSQLResultToReadingBasicInfoModel(
    readingResultSQL: ReadingBasicInfoSQLResult,
  ): ReadingBasicInfoModel {
    return new ReadingBasicInfoModel(
      readingResultSQL.reading_id,
      readingResultSQL.previous_reading_date,
      readingResultSQL.cadastral_key,
      readingResultSQL.card_id,
      readingResultSQL.client_name,
      readingResultSQL.address,
      readingResultSQL.previous_reading,
      readingResultSQL.current_reading,
      readingResultSQL.sector,
      readingResultSQL.account,
      readingResultSQL.reading_value,
      readingResultSQL.average_consumption,
      readingResultSQL.meter_number,
      readingResultSQL.rate_id,
      readingResultSQL.rate_name,
    );
  }

  static fromReadingPostgreSQLResultToReadingResponse(
    readingResultSQL: ReadingSQLResult,
  ): ReadingResponse {
    const response: ReadingResponse = {
      readingId: readingResultSQL.reading_id,
      connectionId: readingResultSQL.connection_id,
      readingDate: readingResultSQL.reading_date,
      readingTime: readingResultSQL.reading_time,
      sector: readingResultSQL.sector,
      account: readingResultSQL.account,
      cadastralKey: readingResultSQL.cadastral_key,
      readingValue: readingResultSQL.reading_value,
      sewerRate: readingResultSQL.sewer_rate,
      previousReading: readingResultSQL.previous_reading,
      currentReading: readingResultSQL.current_reading,
      rentalIncomeCode: readingResultSQL.rental_income_code,
      novelty: readingResultSQL.novelty,
      incomeCode: readingResultSQL.income_code,
      locationCapture: readingResultSQL.location_capture ?? null,
    };
    return response;
  }

  static fromReadingSQLResultToReadingModel(
    readingResultSQL: ReadingSQLResult,
  ): ReadingModel {
    return new ReadingModel(
      readingResultSQL.reading_id,
      readingResultSQL.connection_id,
      readingResultSQL.reading_date ?? new Date(), // Handle null if strictly required, or update Entity to accept null
      readingResultSQL.reading_time ?? '',
      readingResultSQL.sector,
      readingResultSQL.account,
      readingResultSQL.cadastral_key,
      readingResultSQL.reading_value ?? 0,
      readingResultSQL.sewer_rate ?? 0,
      readingResultSQL.previous_reading ?? 0,
      readingResultSQL.current_reading ?? 0,
      readingResultSQL.rental_income_code ?? 0,
      readingResultSQL.novelty,
      readingResultSQL.income_code,
      1, // default ID or fetch from DB
      '', // currentMonthReading placeholder
      readingResultSQL.location_capture ?? null,
      readingResultSQL.reading_code ?? '',
    );
  }

  static fromReadingPhonesPostgreSQLResultsToReadingPhonesModels(
    clientPhones: ClientPhoneSQLResult[],
  ): ClientPhoneModel[] {
    return clientPhones.map((phone) => ({
      telefonoid: phone.telefono_id,
      numero: phone.numero,
    }));
  }

  static fromReadingEmailsPostgreSQLResultsToReadingEmailsModels(
    clientEmails: ClientEmailSQLResult[],
  ): ClientEmailModel[] {
    return clientEmails.map((email) => ({
      emailid: email.correo_electronico_id,
      email: email.correo,
    }));
  }

  static fromReadingPostgreSQLResultToReadingInfoModel(
    readingResultSQL: ReadingInfoSQLResult,
  ): ReadingInfoModel {
    return new ReadingInfoModel(
      readingResultSQL.reading_id,
      readingResultSQL.previous_reading_date,
      readingResultSQL.reading_time,
      readingResultSQL.reading_date,
      readingResultSQL.cadastral_key,
      readingResultSQL.card_id,
      readingResultSQL.client_name,
      this.fromReadingPhonesPostgreSQLResultsToReadingPhonesModels(
        readingResultSQL.client_phones,
      ),
      this.fromReadingEmailsPostgreSQLResultsToReadingEmailsModels(
        readingResultSQL.client_emails,
      ),
      readingResultSQL.address,
      readingResultSQL.previous_reading,
      readingResultSQL.current_reading,
      readingResultSQL.sector,
      readingResultSQL.account,
      readingResultSQL.reading_value,
      readingResultSQL.average_consumption,
      readingResultSQL.meter_number,
      readingResultSQL.rate_id,
      readingResultSQL.rate_name,
      readingResultSQL.has_current_reading === true ||
        readingResultSQL.has_current_reading === 1, // Convert to boolean if it's a number
      readingResultSQL.month_reading,
      readingResultSQL.start_date_period,
      readingResultSQL.end_date_period,
      readingResultSQL.connection_state_id,
      readingResultSQL.connection_state_name,
      readingResultSQL.connection_state_description,
      readingResultSQL.permit_reading === true ||
        readingResultSQL.permit_reading === 1, // Convert to boolean if it's a number
      readingResultSQL.connection_location ?? null,
      readingResultSQL.images ?? [],
      readingResultSQL.observations ?? [],
      readingResultSQL.readingLocation ?? null,
    );
  }

  static fromReadingPostgreSQLResultToReadingDetailedModel(
    readingResultSQL: ReadingDetailedSQLResult,
  ): ReadingDetailedModel {
    return new ReadingDetailedModel(
      readingResultSQL.reading_id,
      readingResultSQL.reading_time,
      readingResultSQL.reading_date,
      readingResultSQL.cadastral_key,
      readingResultSQL.card_id,
      readingResultSQL.client_name,
      this.fromReadingPhonesPostgreSQLResultsToReadingPhonesModels(
        readingResultSQL.client_phones,
      ),
      this.fromReadingEmailsPostgreSQLResultsToReadingEmailsModels(
        readingResultSQL.client_emails,
      ),
      readingResultSQL.address,
      readingResultSQL.previous_reading,
      readingResultSQL.current_reading,
      readingResultSQL.sector,
      readingResultSQL.account,
      readingResultSQL.reading_value,
      readingResultSQL.average_consumption,
      readingResultSQL.meter_number,
      readingResultSQL.rate_id,
      readingResultSQL.rate_name,
      readingResultSQL.has_current_reading === true ||
        readingResultSQL.has_current_reading === 1, // Convert to boolean if it's a number
      readingResultSQL.reading_month,
      readingResultSQL.reading_month_name,
      readingResultSQL.novelty,
      readingResultSQL.consumption,
      readingResultSQL.start_date_period,
      readingResultSQL.end_date_period,
      readingResultSQL.connection_state_id,
      readingResultSQL.connection_state_name,
      readingResultSQL.connection_state_description,
      readingResultSQL.permit_reading === true ||
        readingResultSQL.permit_reading === 1, // Convert to boolean if it's a number
      readingResultSQL.connection_location ?? null,
      readingResultSQL.images ?? [],
      readingResultSQL.observations ?? [],
      readingResultSQL.readingLocation ?? null,
    );
  }

  static fromReadingPostgreSQLResultToAdvancedReportReadingsModel(
    readingResultSQL: AdvancedReportReadingsSQLResult,
  ): AdvancedReportReadingsModel {
    const response: AdvancedReportReadingsModel =
      new AdvancedReportReadingsModel(
        readingResultSQL.sector,
        readingResultSQL.total_connections,
        readingResultSQL.readings_completed,
        readingResultSQL.missing_readings,
        readingResultSQL.progress_percentage,
        readingResultSQL.pure_active_units,
        readingResultSQL.suspended_or_arrears_with_reading,
        readingResultSQL.data_discrepancy,
        readingResultSQL.total_visit_efficiency,
        // Audit cross-validation fields
        readingResultSQL.audit_total_esperado,
        readingResultSQL.audit_total_completadas,
        readingResultSQL.audit_avance_porcentaje,
        readingResultSQL.audit_completo,
      );
    return response;
  }

  static fromReadingPostgreSQLResultToReadingHistoryModel(
    readingResultSQL: ReadingHistorySQLResult,
  ): ReadingHistoryModel {
    const response: ReadingHistoryModel = new ReadingHistoryModel(
      readingResultSQL.reading_id,
      readingResultSQL.connection_id,
      readingResultSQL.reading_year,
      readingResultSQL.reading_month,
      readingResultSQL.reading_date,
      readingResultSQL.reading_time,
      readingResultSQL.previous_reading,
      readingResultSQL.current_reading,
      readingResultSQL.consumption,
      readingResultSQL.observation,
      readingResultSQL.reading_value,
    );
    return response;
  }

  static fromReadingPostgreSQLResultToReadingImagesModel(
    readingResultSQL: ReadingImagesSQLResult,
  ): ReadingImagesModel {
    const response: ReadingImagesModel = {
      cadastralKey: readingResultSQL.cadastral_key,
      readingId: readingResultSQL.reading_id,
      previewsReading: readingResultSQL.previews_reading,
      currentReading: readingResultSQL.current_reading,
      images: readingResultSQL.images,
      readingMonth: readingResultSQL.reading_month,
      readingYear: readingResultSQL.reading_year,
      readingMonthName: readingResultSQL.reading_month_name,
      novelty: readingResultSQL.novelty,
      consumption: readingResultSQL.consumption,
      observation: readingResultSQL.observation,
    };
    return response;
  }

  static fromPendingReadingConnectionPostgreSQLResultToPendingReadingConnectionModel(
    pendingReadingConnectionResultSQL: PendingReadingConnectionSQLResult,
  ): PendingReadingConnectionModel {
    return new PendingReadingConnectionModel(
      pendingReadingConnectionResultSQL.cadastral_key,
      pendingReadingConnectionResultSQL.meter_number,
      pendingReadingConnectionResultSQL.address,
      pendingReadingConnectionResultSQL.sector,
      pendingReadingConnectionResultSQL.account,
      pendingReadingConnectionResultSQL.client_name,
      pendingReadingConnectionResultSQL.card_id,
      pendingReadingConnectionResultSQL.rate_name,
      pendingReadingConnectionResultSQL.average_consumption,
    );
  }

  static fromTakenReadingConnectionPostgreSQLResultToTakenReadingConnectionModel(
    takenReadingConnectionResultSQL: TakenReadingConnectionSQLResult,
  ): TakenReadingConnectionModel {
    return new TakenReadingConnectionModel(
      takenReadingConnectionResultSQL.reading_id,
      takenReadingConnectionResultSQL.reading_date,
      takenReadingConnectionResultSQL.cadastral_key,
      takenReadingConnectionResultSQL.meter_number,
      takenReadingConnectionResultSQL.address,
      takenReadingConnectionResultSQL.sector,
      takenReadingConnectionResultSQL.account,
      takenReadingConnectionResultSQL.client_name,
      takenReadingConnectionResultSQL.card_id,
      takenReadingConnectionResultSQL.previous_reading,
      takenReadingConnectionResultSQL.current_reading,
      takenReadingConnectionResultSQL.reading_value,
      takenReadingConnectionResultSQL.calculated_consumption,
      takenReadingConnectionResultSQL.average_consumption,
      takenReadingConnectionResultSQL.rate_name,
      takenReadingConnectionResultSQL.reading_type_id,
      takenReadingConnectionResultSQL.reading_type_name,
      takenReadingConnectionResultSQL.novelty,
      takenReadingConnectionResultSQL.location_capture ?? null,
      takenReadingConnectionResultSQL.location_connection ?? null,
      takenReadingConnectionResultSQL.distance_meters ?? null,
      takenReadingConnectionResultSQL.is_inside_allowed_radius ?? null,
      takenReadingConnectionResultSQL.distance_line_geojson ?? null,
      takenReadingConnectionResultSQL.reading_code ?? null,
      takenReadingConnectionResultSQL.creator_card_id ?? null,
      (takenReadingConnectionResultSQL.creator_first_name +
        ' ' +
        takenReadingConnectionResultSQL.creator_last_name ||
        '') ??
        null,
      takenReadingConnectionResultSQL.updater_card_id ?? null,
      (takenReadingConnectionResultSQL.updater_first_name +
        ' ' +
        takenReadingConnectionResultSQL.updater_last_name ||
        '') ??
        null,
    );
  }

  static fromMonthlySummarySQLResultToMonthlySummaryModel(
    monthlySummaryResultSQL: MonthlySummarySQLResult,
  ): MonthlySummaryModel {
    return new MonthlySummaryModel(
      monthlySummaryResultSQL.month,
      monthlySummaryResultSQL.total_readings,
      monthlySummaryResultSQL.total_consumption,
      monthlySummaryResultSQL.average_consumption,
      monthlySummaryResultSQL.max_consumption,
      monthlySummaryResultSQL.min_consumption,
      monthlySummaryResultSQL.incident_count,
      monthlySummaryResultSQL.incident_rate_percentage,
    );
  }

  static fromReadingNoveltySQLResultToReadingNoveltyModel(
    readingNoveltyResultSQL: ReadingNoveltySQLResult,
  ): ReadingNoveltyModel {
    const response: ReadingNoveltyModel = {
      readingId: readingNoveltyResultSQL.reading_id,
      readingDate: readingNoveltyResultSQL.reading_date,
      readingMonth: readingNoveltyResultSQL.reading_month,
      readingTime: readingNoveltyResultSQL.reading_time,
      cadastralKey: readingNoveltyResultSQL.cadastral_key,
      meterNumber: readingNoveltyResultSQL.meter_number,
      address: readingNoveltyResultSQL.address,
      sector: readingNoveltyResultSQL.sector,
      account: readingNoveltyResultSQL.account,
      clientName: readingNoveltyResultSQL.client_name,
      cardId: readingNoveltyResultSQL.card_id,
      previousReading: readingNoveltyResultSQL.previous_reading,
      currentReading: readingNoveltyResultSQL.current_reading,
      readingValue: readingNoveltyResultSQL.reading_value,
      calculatedConsumption: readingNoveltyResultSQL.calculated_consumption,
      averageConsumption: readingNoveltyResultSQL.average_consumption,
      rateName: readingNoveltyResultSQL.rate_name,
      readingTypeId: readingNoveltyResultSQL.reading_type_id,
      readingTypeName: readingNoveltyResultSQL.reading_type_name,
      novelty: readingNoveltyResultSQL.novelty,
      noveltyTypeId: readingNoveltyResultSQL.novelty_type_id,
      noveltyTypeName: readingNoveltyResultSQL.novelty_type_name,
      noveltyTypeDescription: readingNoveltyResultSQL.novelty_type_description,
      images: readingNoveltyResultSQL.images,
      locationCapture: readingNoveltyResultSQL.location_capture ?? null,
      locationConnection: readingNoveltyResultSQL.location_connection ?? null,
      distanceMeters: readingNoveltyResultSQL.distance_meters ?? null,
      isInsideAllowedRadius:
        readingNoveltyResultSQL.is_inside_allowed_radius ?? null,
      distanceLineGeoJSON:
        readingNoveltyResultSQL.distance_line_geojson ?? null,
      readingCode: readingNoveltyResultSQL.reading_code ?? null,
      userCreatedId: readingNoveltyResultSQL.creator_card_id ?? null,
      userCreatedName:
        (readingNoveltyResultSQL.creator_first_name +
          ' ' +
          readingNoveltyResultSQL.creator_last_name ||
          '') ??
        null,
      userUpdatedId: readingNoveltyResultSQL.updater_card_id ?? null,
      userUpdatedName:
        (readingNoveltyResultSQL.updater_first_name +
          ' ' +
          readingNoveltyResultSQL.updater_last_name ||
          '') ??
        null,
    };
    return response;
  }
}
