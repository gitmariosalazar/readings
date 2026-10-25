import {
  ReadingModel,
  ReadingNoveltyModel,
} from '../schemas/model/reading.model';
import { ReadingBasicInfoModel } from '../schemas/model/reading-basic-info.model';
import {
  ReadingDetailedModel,
  ReadingInfoModel,
} from '../schemas/model/reading-info.model';
import { ReadingHistoryModel } from '../schemas/model/reading-history.model';
import { ReadingImagesModel } from '../schemas/model/reading-images.model';
import { PendingReadingConnectionModel } from '../schemas/model/pending-reading-connection.model';
import { TakenReadingConnectionModel } from '../schemas/model/taken-reading-connection.model';
import { ReadingAdjustmentModel } from '../schemas/model/reading-adjustment.model';
import { UUID } from 'crypto';
import {
  HistorialAjusteLectura,
  MapRouteFeatureCollection,
} from '../schemas/response/map-geojson';
import {
  RateConnectionModel,
  RateRangeModel,
} from '../schemas/model/calculate-reading-value.model';
import { ConnectionBenefitModel } from '../schemas/model/connection-benefit.model';
import { BillingConceptValidity } from '../../infrastructure/interfaces/sql/reading-sql.result.interface';

export interface InterfaceReadingRepository {
  findReadingBasicInfo(cadastralKey: string): Promise<ReadingBasicInfoModel[]>;
  updateCurrentReading(
    readingId: number,
    readingModel: ReadingModel,
    updateUserId: UUID,
    auditData?: ReadingAdjustmentModel,
  ): Promise<ReadingModel | null>;
  updateSpecialReading(
    readingId: number,
    readingModel: ReadingModel,
    auditData: ReadingAdjustmentModel,
  ): Promise<ReadingModel | null>;
  verifyReadingIfExist(readingId: number): Promise<boolean>;
  createReading(
    readingModel: ReadingModel,
    creatorUserId: UUID,
  ): Promise<ReadingModel | null>;
  findReadingInfo(cadastralKey: string): Promise<ReadingInfoModel[]>;
  findReadingInfoForUpdated(
    cadastralKey: string,
    yearAndMonth?: string,
  ): Promise<ReadingInfoModel[]>;
  findReadingHistoryByCadastralKey(
    cadastralKey: string,
    limit: number,
    offset: number,
  ): Promise<ReadingHistoryModel[]>;

  getPendingReadingsByMonth(
    dateMonth: string,
    sector?: number,
  ): Promise<PendingReadingConnectionModel[]>;

  getTakenReadingsByMonth(
    dateMonth: string,
    sector?: number,
    userId?: string,
    date?: string,
    failed?: boolean,
  ): Promise<TakenReadingConnectionModel[]>;

  getTakenReadingEstimatesOrAverage(
    month: string,
    sector?: number,
    userId?: string,
    date?: string,
  ): Promise<TakenReadingConnectionModel[]>;

  getReadingByNovelty(
    dateMonth: string,
    novelty?: string,
    sector?: number,
    userId?: string,
  ): Promise<ReadingNoveltyModel[]>;

  getMapGeojsonByDayAndByUser(
    date: string,
    userId?: string,
  ): Promise<MapRouteFeatureCollection>; // Replace 'any' with the appropriate GeoJSON type if available

  getDetailedReadingInfoByCadastralKey(
    cadastralKey: string,
    yearAndMonth: string,
  ): Promise<ReadingDetailedModel | null>;

  generateInitialReadingOnMeterChange(
    acometidaId: string,
    nuevoNumeroMedidor: string,
    sector: number,
    cuenta: number,
    claveCatastral: string,
    fechaInicioLecturas: Date | string,
  ): Promise<void>;

  getReadingAdjustmentHistoryByReadingId(
    readingId: number,
  ): Promise<HistorialAjusteLectura[]>;

  getBillingConceptValidity(): Promise<BillingConceptValidity[]>;
  getRateConnection(cadastralKey: string): Promise<RateConnectionModel>;
  getRateRange(tarifaId: number): Promise<RateRangeModel[]>;
  getActiveBenefitsByCadastralKey?(
    cadastralKey: string,
  ): Promise<ConnectionBenefitModel[]>;
}
