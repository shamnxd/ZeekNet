import { ISkillRepository } from 'src/domain/interfaces/repositories/skill/ISkillRepository';
import { Skill } from 'src/domain/entities/skill.entity';
import { ICreateSkillUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/skills/ICreateSkillUseCase';
import { BadRequestError, ConflictError } from 'src/domain/errors/errors';
import { CreateInput } from 'src/domain/types/common.types';
import { CreateSkillRequestDto } from 'src/application/dtos/admin/attributes/skills/requests/create-skill-request.dto';

export class CreateSkillUseCase implements ICreateSkillUseCase {
  constructor(private readonly _skillRepository: ISkillRepository) { }

  async execute(dto: CreateSkillRequestDto): Promise<Skill> {
    const { name } = dto;

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
