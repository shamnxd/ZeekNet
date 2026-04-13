import { ISkillRepository } from 'src/domain/interfaces/repositories/skill/ISkillRepository';
import { Skill } from 'src/domain/entities/skill.entity';
import { IGetSkillByIdUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/skills/IGetSkillByIdUseCase';
import { NotFoundError } from 'src/domain/errors/errors';
import { SkillResponseDto } from 'src/application/dtos/admin/attributes/skills/responses/skill-response.dto';
import { SkillMapper } from 'src/application/mappers/skill/skill.mapper';
import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ERROR } from 'src/shared/constants/messages';


@injectable()
export class GetSkillByIdUseCase implements IGetSkillByIdUseCase {
  constructor(@inject(TYPES.SkillRepository) private readonly _skillRepository: ISkillRepository) {}

  async execute(skillId: string): Promise<SkillResponseDto> {
    const skill = await this._skillRepository.findById(skillId);
    
    if (!skill) {
      throw new NotFoundError(ERROR.NOT_FOUND('Skill'));
    }

    return SkillMapper.toResponse(skill);
  }
}
