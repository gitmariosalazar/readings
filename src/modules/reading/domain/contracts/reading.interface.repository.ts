import { ReadingModel } from '../schemas/model/reading.model';
import { ReadingBasicInfoModel } from '../schemas/model/reading-basic-info.model';
import { ReadingInfoModel } from '../schemas/model/reading-info.model';
import { ReadingHistoryModel } from '../schemas/model/reading-history.model';
import { ReadingImagesModel } from '../schemas/model/reading-images.model';

export interface InterfaceReadingRepository {
  findReadingBasicInfo(cadastralKey: string): Promise<ReadingBasicInfoModel[]>;
  updateCurrentReading(
    readingId: number,
    readingModel: ReadingModel,
  ): Promise<ReadingModel | null>;
  verifyReadingIfExist(readingId: number): Promise<boolean>;
  createReading(readingModel: ReadingModel): Promise<ReadingModel | null>;
  findReadingInfo(cadastralKey: string): Promise<ReadingInfoModel[]>;
  findReadingHistoryByCadastralKey(
    cadastralKey: string,
    limit: number,
    offset: number,
  ): Promise<ReadingHistoryModel[]>;
  findReadingsImagesByCadastralKey(
    cadastralKey: string,
  ): Promise<ReadingImagesModel[]>;
  getAllReadingsImages(): Promise<ReadingImagesModel[]>;
}
