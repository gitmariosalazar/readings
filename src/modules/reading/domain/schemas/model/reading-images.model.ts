export class ReadingImagesModel {
  constructor(
    public readonly cadastralKey: string,
    public readonly readingId: number,
    public readonly previewsReading: number,
    public readonly currentReading: number,
    public readonly images: string[],
    public readonly readingMonth: string,
    public readonly readingYear: number,
    public readonly readingMonthName: string,
    public readonly novelty: string,
    public readonly consumption: number,
    public readonly observation: string,
    public readonly updatedStatus: boolean,
  ) {}
}
