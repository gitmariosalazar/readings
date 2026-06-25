import { NoveltyModel } from '../../domain/schemas/model/novelty.model';
import { NoveltySQLResult } from '../interfaces/sql/novelty.sql-result';

export class NoveltySQLAdapter {
  /**
   * Converts a NoveltySQLResult object to an INovelty object.
   * @param sqlResult - The NoveltySQLResult object to convert.
   * @returns An INovelty object.
   */
  public static toDomain(sqlResult: NoveltySQLResult): NoveltyModel {
    return new NoveltyModel(
      sqlResult.id,
      sqlResult.title,
      sqlResult.description,
      sqlResult.min_percentage,
      sqlResult.max_percentage,
      sqlResult.action_recommended,
    );
  }
}
