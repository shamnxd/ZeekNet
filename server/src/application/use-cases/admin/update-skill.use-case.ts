import { ISkillRepository } from '../../../domain/interfaces/repositories/skill/ISkillRepository';
import { Skill } from '../../../domain/entities/skill.entity';
import { IUpdateSkillUseCase } from 'src/domain/interfaces/use-cases/skills/IUpdateSkillUseCase';
import { BadRequestError, ConflictError, InternalServerError, NotFoundError } from '../../../domain/errors/errors';

export class UpdateSkillUseCase implements IUpdateSkillUseCase {
  constructor(private readonly _skillRepository: ISkillRepository) {}

  async execute(skillId: string, name: string): Promise<Skill> {
    if (!name || !name.trim()) {
      throw new BadRequestError('Skill name is required');
    }

    const normalizedName = name.trim();
    const existingSkill = await this._skillRepository.findById(skillId);
    
    if (!existingSkill) {
      throw new NotFoundError('Skill not found');
    }

    const skillWithSameName = await this._skillRepository.findByName(normalizedName);
    
    if (skillWithSameName && skillWithSameName.id !== skillId) {
      throw new ConflictError('Skill with this name already exists');
    }

    const updatedSkill = await this._skillRepository.update(skillId, { name: normalizedName });
    
    if (!updatedSkill) {
      throw new InternalServerError('Failed to update skill');
    }

    return updatedSkill;
  }
}
