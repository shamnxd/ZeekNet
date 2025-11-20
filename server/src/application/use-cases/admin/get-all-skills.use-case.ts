import { ISkillRepository, SkillQueryFilters } from '../../../domain/interfaces/repositories/skill/ISkillRepository';
import { PaginatedSkills, IGetAllSkillsUseCase } from '../../../domain/interfaces/use-cases/IAdminUseCases';

export class GetAllSkillsUseCase implements IGetAllSkillsUseCase {
  constructor(private readonly _skillRepository: ISkillRepository) {}

  async execute(options: { page?: number; limit?: number; search?: string }): Promise<PaginatedSkills> {
    const filters: SkillQueryFilters = {
      page: options.page,
      limit: options.limit,
      search: options.search,
      sortBy: 'name',
      sortOrder: 'asc',
    };

    return await this._skillRepository.findAllWithPagination(filters);
  }
}
