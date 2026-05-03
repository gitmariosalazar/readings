import { ReadingModel } from '../schemas/model/reading.model';
import { ReadingBasicInfoModel } from '../schemas/model/reading-basic-info.model';
import { ReadingInfoModel } from '../schemas/model/reading-info.model';
import { ReadingHistoryModel } from '../schemas/model/reading-history.model';
import { ReadingImagesModel } from '../schemas/model/reading-images.model';
import { PendingReadingConnectionModel } from '../schemas/model/pending-reading-connection.model';
import { TakenReadingConnectionModel } from '../schemas/model/taken-reading-connection.model';
import { UUID } from 'crypto';

export interface InterfaceReadingRepository {
  findReadingBasicInfo(cadastralKey: string): Promise<ReadingBasicInfoModel[]>;
  updateCurrentReading(
    readingId: number,
    readingModel: ReadingModel,
    updateUserId: UUID,
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
  ): Promise<TakenReadingConnectionModel[]>;

  getTakenReadingEstimatesOrAverage(
    month: string,
    sector?: number,
  ): Promise<TakenReadingConnectionModel[]>;
}
