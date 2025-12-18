import { IGetAllSkillsUseCase } from 'src/domain/interfaces/use-cases/skills/IGetAllSkillsUseCase';
import { ISkillRepository } from '../../../domain/interfaces/repositories/skill/ISkillRepository';
import { PaginatedSkillsResultDto } from '../../dto/skills/paginated-skills-result.dto';
import { SkillMapper } from '../../mappers/skill.mapper';

export class GetAllSkillsUseCase implements IGetAllSkillsUseCase {
  constructor(private readonly _skillRepository: ISkillRepository) {}

  async execute(options: { page?: number; limit?: number; search?: string }): Promise<PaginatedSkillsResultDto> {
    const query: Record<string, unknown> = {};
    if (options.search) {
      query.name = { $regex: options.search, $options: 'i' };
    }

    const result = await this._skillRepository.paginate(query, {
      page: options.page,
      limit: options.limit,
      sortBy: 'name',
      sortOrder: 'asc',
    });
    return {
      skills: SkillMapper.toResponseList(result.data),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }
}
