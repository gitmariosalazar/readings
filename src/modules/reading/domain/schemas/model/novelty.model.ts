export class NoveltyModel {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly description: string,
    public readonly minPercentage: number | null,
    public readonly maxPercentage: number | null,
    public readonly actionRecommended: string,
  ) {}
}
