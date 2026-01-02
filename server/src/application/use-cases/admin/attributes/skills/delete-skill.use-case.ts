import { ISkillRepository } from 'src/domain/interfaces/repositories/skill/ISkillRepository';
import { IDeleteSkillUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/skills/IDeleteSkillUseCase';
import { AppError } from 'src/domain/errors/errors';
import { HttpStatus } from 'src/domain/enums/http-status.enum';

export class DeleteSkillUseCase implements IDeleteSkillUseCase {
  constructor(private readonly _skillRepository: ISkillRepository) {}

  async execute(skillId: string): Promise<boolean> {
    const skill = await this._skillRepository.findById(skillId);
    
    if (!skill) {
      throw new AppError('Skill not found', HttpStatus.NOT_FOUND);
    }

    const deleted = await this._skillRepository.delete(skillId);
    
    if (!deleted) {
      throw new AppError('Failed to delete skill', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return true;
  }
}
