import { ISkillRepository } from '../../../domain/interfaces/repositories/skill/ISkillRepository';
import { Skill } from '../../../domain/entities/skill.entity';
import { IGetSkillByIdUseCase } from 'src/domain/interfaces/use-cases/admin/IGetSkillByIdUseCase';
import { AppError } from '../../../domain/errors/errors';

export class GetSkillByIdUseCase implements IGetSkillByIdUseCase {
  constructor(private readonly _skillRepository: ISkillRepository) {}

  async execute(skillId: string): Promise<Skill> {
    const skill = await this._skillRepository.findById(skillId);
    
    if (!skill) {
      throw new AppError('Skill not found', 404);
    }

    return skill;
  }
}
