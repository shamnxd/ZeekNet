import { ISkillRepository } from 'src/domain/interfaces/repositories/skill/ISkillRepository';
import { Skill } from 'src/domain/entities/skill.entity';
import { IUpdateSkillUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/skills/IUpdateSkillUseCase';
import { BadRequestError, ConflictError, InternalServerError, NotFoundError } from 'src/domain/errors/errors';
import { UpdateSkillRequestDto } from 'src/application/dtos/admin/attributes/skills/requests/update-skill-request.dto';
import { SkillResponseDto } from 'src/application/dtos/admin/attributes/skills/responses/skill-response.dto';
import { SkillMapper } from 'src/application/mappers/skill/skill.mapper';
import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ERROR, VALIDATION } from 'src/shared/constants/messages';


@injectable()
export class UpdateSkillUseCase implements IUpdateSkillUseCase {
  constructor(@inject(TYPES.SkillRepository) private readonly _skillRepository: ISkillRepository) { }

  async execute(skillId: string, dto: UpdateSkillRequestDto): Promise<SkillResponseDto> {
    const { name } = dto;

    if (!name || !name.trim()) {
      throw new BadRequestError(VALIDATION.REQUIRED('Skill name'));
    }

    const normalizedName = name.trim();
    const existingSkill = await this._skillRepository.findById(skillId);

    if (!existingSkill) {
      throw new NotFoundError(ERROR.NOT_FOUND('Skill'));
    }

    const skillWithSameName = await this._skillRepository.findByName(normalizedName);

    if (skillWithSameName && skillWithSameName.id !== skillId) {
      throw new ConflictError(ERROR.ALREADY_EXISTS('Skill with this name'));
    }

    const updatedSkill = await this._skillRepository.update(skillId, { name: normalizedName });

    if (!updatedSkill) {
      throw new InternalServerError(ERROR.FAILED_TO('update skill'));
    }

    return SkillMapper.toResponse(updatedSkill);
  }
}
