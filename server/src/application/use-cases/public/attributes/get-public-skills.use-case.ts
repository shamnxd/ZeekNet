import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ISkillRepository } from 'src/domain/interfaces/repositories/skill/ISkillRepository';
import { IGetPublicSkillsUseCase } from 'src/domain/interfaces/use-cases/public/attributes/IGetPublicSkillsUseCase';

@injectable()
export class GetPublicSkillsUseCase implements IGetPublicSkillsUseCase {
  constructor(@inject(TYPES.SkillRepository) private readonly _skillRepository: ISkillRepository) {}

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
