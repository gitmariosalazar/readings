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
import { MapRouteFeatureCollection } from '../schemas/response/map-geojson';

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
  ): Promise<TakenReadingConnectionModel[]>;

  getTakenReadingEstimatesOrAverage(
    month: string,
    sector?: number,
    userId?: string,
  ): Promise<TakenReadingConnectionModel[]>;

  getReadingByNovelty(
    dateMonth: string,
    novelty?: string,
    sector?: number,
    userId?: string,
  ): Promise<ReadingNoveltyModel[]>;

  calculateReadingValue(
    cadastralKey: string,
    consumptionM3: number,
  ): Promise<number>;

  getMapGeojsonByDayAndByUser(
    date: string,
    userId?: string,
  ): Promise<MapRouteFeatureCollection>; // Replace 'any' with the appropriate GeoJSON type if available

  getDetailedReadingInfoByCadastralKey(
    cadastralKey: string,
    yearAndMonth: string,
  ): Promise<ReadingDetailedModel | null>;
}
