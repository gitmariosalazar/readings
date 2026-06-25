import { Inject, Injectable } from '@nestjs/common';
import { NoveltyResponse } from '../../dtos/response/novelty.response';
import { InterfaceNoveltyRepository } from '../../../domain/contracts/novelty.interface.repository';
import { NoveltyMapper } from '../../mappers/novelty.mapper';

@Injectable()
export class FindAllNoveltiesUseCase {
  constructor(
    @Inject('NoveltyRepository')
    private readonly noveltyRepository: InterfaceNoveltyRepository,
  ) {}

  async execute(): Promise<NoveltyResponse[]> {
    const domainModels = await this.noveltyRepository.findAllNovelties();
    return domainModels.map(NoveltyMapper.toResponse);
  }
}
