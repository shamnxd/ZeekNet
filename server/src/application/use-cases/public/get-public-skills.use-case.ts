import { ISkillRepository } from '../../../domain/interfaces/repositories/skill/ISkillRepository';
import { IGetPublicSkillsUseCase } from 'src/domain/interfaces/use-cases/public/IGetPublicSkillsUseCase';

export class GetPublicSkillsUseCase implements IGetPublicSkillsUseCase {
  constructor(private readonly _skillRepository: ISkillRepository) {}

  async execute(): Promise<string[]> {
    const result = await this._skillRepository.paginate({}, {
      page: 1,
      limit: 1000,
      sortBy: 'name',
      sortOrder: 'asc',
    });

    return result.data.map((skill) => skill.name);
  }
}
