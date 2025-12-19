import { ISkillRepository } from '../../../domain/interfaces/repositories/skill/ISkillRepository';
import { Skill } from '../../../domain/entities/skill.entity';
import { ICreateSkillUseCase } from 'src/domain/interfaces/use-cases/skills/ICreateSkillUseCase';
import { BadRequestError, ConflictError } from '../../../domain/errors/errors';
import { CreateInput } from '../../../domain/types/common.types';

export class CreateSkillUseCase implements ICreateSkillUseCase {
  constructor(private readonly _skillRepository: ISkillRepository) {}

  async execute(name: string): Promise<Skill> {
    if (!name || !name.trim()) {
      throw new BadRequestError('Skill name is required');
    }

    const normalizedName = name.trim();
    const existingSkill = await this._skillRepository.findByName(normalizedName);
    
    if (existingSkill) {
      throw new ConflictError('Skill with this name already exists');
    }

    return await this._skillRepository.create({ name: normalizedName } as CreateInput<Skill>);
  }
}
