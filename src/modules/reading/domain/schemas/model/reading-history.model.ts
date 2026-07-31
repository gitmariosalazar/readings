export class ReadingHistoryModel {
  constructor(
    public readingId: number,
    public connectionId: string,
    public readingYear: number,
    public readingMonth: string,
    public readingDate: Date,
    public readingTime: string,
    public previousReading: number,
    public currentReading: number,
    public consumption: number,
    public observation: string,
    public readingValue: number,
  ) {}
}
