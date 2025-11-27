import { ISkillRepository } from '../../../domain/interfaces/repositories/skill/ISkillRepository';
import { PaginatedSkills, IGetAllSkillsUseCase } from '../../../domain/interfaces/use-cases/IAdminUseCases';

export class GetAllSkillsUseCase implements IGetAllSkillsUseCase {
  constructor(private readonly _skillRepository: ISkillRepository) {}

  async execute(options: { page?: number; limit?: number; search?: string }): Promise<PaginatedSkills> {
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
      skills: result.data.map((skill) => ({
        id: skill.id,
        name: skill.name,
        createdAt: skill.createdAt,
        updatedAt: skill.updatedAt,
      })),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }
}
