import { ISkillRepository } from '../../../domain/interfaces/repositories/skill/ISkillRepository';
import { Skill } from '../../../domain/entities/skill.entity';
import { ICreateSkillUseCase } from '../../../domain/interfaces/use-cases/IAdminUseCases';
import { AppError } from '../../../domain/errors/errors';

export class CreateSkillUseCase implements ICreateSkillUseCase {
  constructor(private readonly _skillRepository: ISkillRepository) {}

  async execute(name: string): Promise<Skill> {
    if (!name || !name.trim()) {
      throw new AppError('Skill name is required', 400);
    }

    const normalizedName = name.trim();
    const existingSkill = await this._skillRepository.findByName(normalizedName);
    
    if (existingSkill) {
      throw new AppError('Skill with this name already exists', 409);
    }

    return await this._skillRepository.create({ name: normalizedName } as Omit<Skill, 'id' | '_id' | 'createdAt' | 'updatedAt'>);
  }
}
