import { ReadingImagesModel } from '../schemas/model/reading-images.model';

export interface InterfaceReadingImagesRepository {
  findReadingImagesByCadastralKey(
    cadastralKey: string,
  ): Promise<ReadingImagesModel[]>;

  findReadingImagesByMonth(month: string): Promise<ReadingImagesModel[]>;

  findReadingImagesByMonthAndSector(
    month: string,
    sector: number,
  ): Promise<ReadingImagesModel[]>;

  getAllReadingsImages(): Promise<ReadingImagesModel[]>;
}
