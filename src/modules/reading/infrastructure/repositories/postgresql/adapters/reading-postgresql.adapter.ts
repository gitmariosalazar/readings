import {
  emails,
  phones,
  ReadingBasicInfoResponse,
  ReadingInfoResponse,
} from '../../../../application/dtos/response/reading-basic.response';
import { ReadingModel } from '../../../../domain/schemas/model/reading.model';
import { ReadingBasicInfoModel } from '../../../../domain/schemas/model/reading-basic-info.model';
import {
  ReadingInfoModel,
  ClientPhoneModel,
  ClientEmailModel,
} from '../../../../domain/schemas/model/reading-info.model';
import { ReadingResponse } from '../../../../application/dtos/response/reading.response';
import {
  AdvancedReportReadingsSQLResult,
  ClientEmailSQLResult,
  ClientPhoneSQLResult,
  ReadingBasicInfoSQLResult,
  ReadingHistorySQLResult,
  ReadingImagesSQLResult,
  ReadingInfoSQLResult,
  ReadingSQLResult,
} from '../../../interfaces/sql/reading-sql.result.interface';
import { AdvancedReportReadingsModel } from '../../../../domain/schemas/model/report/advanced-report-readings.model';
import { ReadingHistoryModel } from '../../../../domain/schemas/model/reading-history.model';
import { ReadingImagesResponse } from '../../../../application/dtos/response/reading-images.response';
import { number, string } from 'joi';

export class ReadingPostgreSQLAdapter {
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
      readingResultSQL.has_current_reading,
      readingResultSQL.month_reading,
      readingResultSQL.start_date_period,
      readingResultSQL.end_date_period,
    );
  }

  static fromReadingPostgreSQLResultToAdvancedReportReadingsModel(
    readingResultSQL: AdvancedReportReadingsSQLResult,
  ): AdvancedReportReadingsModel {
    const response: AdvancedReportReadingsModel = {
      sector: readingResultSQL.sector,
      totalConnections: readingResultSQL.total_connections,
      readingsCompleted: readingResultSQL.readings_completed,
      missingReadings: readingResultSQL.missing_readings,
      progressPercentage: readingResultSQL.progress_percentage,
    };
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
    );
    return response;
  }

  static fromReadingPostgreSQLResultToReadingImagesModel(
    readingResultSQL: ReadingImagesSQLResult,
  ): ReadingImagesResponse {
    const response: ReadingImagesResponse = {
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
}
