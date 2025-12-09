import { ISkillRepository } from '../../../domain/interfaces/repositories/skill/ISkillRepository';
import { IDeleteSkillUseCase } from 'src/domain/interfaces/use-cases/admin/IDeleteSkillUseCase';
import { AppError } from '../../../domain/errors/errors';

export class DeleteSkillUseCase implements IDeleteSkillUseCase {
  constructor(private readonly _skillRepository: ISkillRepository) {}

  async execute(skillId: string): Promise<boolean> {
    const skill = await this._skillRepository.findById(skillId);
    
    if (!skill) {
      throw new AppError('Skill not found', 404);
    }

    const deleted = await this._skillRepository.delete(skillId);
    
    if (!deleted) {
      throw new AppError('Failed to delete skill', 500);
    }

    return true;
  }
}
