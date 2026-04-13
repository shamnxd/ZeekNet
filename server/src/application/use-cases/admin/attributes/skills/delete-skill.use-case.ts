import { ISkillRepository } from 'src/domain/interfaces/repositories/skill/ISkillRepository';
import { IDeleteSkillUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/skills/IDeleteSkillUseCase';
import { AppError } from 'src/domain/errors/errors';
import { HttpStatus } from 'src/domain/enums/http-status.enum';
import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ERROR } from 'src/shared/constants/messages';


@injectable()
export class DeleteSkillUseCase implements IDeleteSkillUseCase {
  constructor(@inject(TYPES.SkillRepository) private readonly _skillRepository: ISkillRepository) {}

  async execute(skillId: string): Promise<boolean> {
    const skill = await this._skillRepository.findById(skillId);
    
    if (!skill) {
      throw new AppError(ERROR.NOT_FOUND('Skill'), HttpStatus.NOT_FOUND);
    }

    const deleted = await this._skillRepository.delete(skillId);
    
    if (!deleted) {
      throw new AppError(ERROR.FAILED_TO('delete skill'), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return true;
  }
}
