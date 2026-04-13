import { ISkillRepository } from 'src/domain/interfaces/repositories/skill/ISkillRepository';
import { Skill } from 'src/domain/entities/skill.entity';
import { ICreateSkillUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/skills/ICreateSkillUseCase';
import { BadRequestError, ConflictError } from 'src/domain/errors/errors';
import { CreateInput } from 'src/domain/types/common.types';
import { CreateSkillRequestDto } from 'src/application/dtos/admin/attributes/skills/requests/create-skill-request.dto';
import { SkillResponseDto } from 'src/application/dtos/admin/attributes/skills/responses/skill-response.dto';
import { SkillMapper } from 'src/application/mappers/skill/skill.mapper';
import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ERROR, VALIDATION } from 'src/shared/constants/messages';


@injectable()
export class CreateSkillUseCase implements ICreateSkillUseCase {
  constructor(@inject(TYPES.SkillRepository) private readonly _skillRepository: ISkillRepository) { }

  async execute(dto: CreateSkillRequestDto): Promise<SkillResponseDto> {
    const { name } = dto;

    if (!name || !name.trim()) {
      throw new BadRequestError(VALIDATION.REQUIRED('Skill name'));
    }

    const normalizedName = name.trim();
    const existingSkill = await this._skillRepository.findByName(normalizedName);

    if (existingSkill) {
      throw new ConflictError(ERROR.ALREADY_EXISTS('Skill with this name'));
    }

    const skill = await this._skillRepository.create({ name: normalizedName } as CreateInput<Skill>);
    return SkillMapper.toResponse(skill);
  }
}
