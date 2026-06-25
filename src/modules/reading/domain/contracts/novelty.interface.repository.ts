import { NoveltyModel } from '../schemas/model/novelty.model';

export interface InterfaceNoveltyRepository {
  findAllNovelties(): Promise<NoveltyModel[]>;
}
