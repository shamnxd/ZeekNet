import { IGetAllSkillsUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/skills/IGetAllSkillsUseCase';
import { ISkillRepository } from 'src/domain/interfaces/repositories/skill/ISkillRepository';
import { PaginatedSkillsResultDto } from 'src/application/dtos/admin/attributes/skills/responses/paginated-skills-result.dto';
import { SkillMapper } from 'src/application/mappers/skill/skill.mapper';

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


