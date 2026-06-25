import { NoveltyModel } from '../../domain/schemas/model/novelty.model';
import { NoveltyResponse } from '../dtos/response/novelty.response';

export class NoveltyMapper {
  /**
   * Converts a NoveltyModel object to an INovelty object.
   * @param model - The NoveltyModel object to convert.
   * @returns An INovelty object.
   */
  public static toResponse(model: NoveltyModel): NoveltyResponse {
    return {
      id: model.id,
      title: model.title,
      description: model.description,
      minPercentage: model.minPercentage,
      maxPercentage: model.maxPercentage,
      actionRecommended: model.actionRecommended,
    };
  }
}
