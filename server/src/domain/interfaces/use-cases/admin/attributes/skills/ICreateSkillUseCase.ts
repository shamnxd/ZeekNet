import { Skill } from 'src/domain/entities/skill.entity';
import { CreateSkillRequestDto } from 'src/application/dtos/admin/attributes/skills/requests/create-skill-request.dto';

export interface ICreateSkillUseCase {
  execute(dto: CreateSkillRequestDto): Promise<Skill>;
}
