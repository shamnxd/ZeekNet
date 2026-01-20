import { Skill } from 'src/domain/entities/skill.entity';
import { UpdateSkillRequestDto } from 'src/application/dtos/admin/attributes/skills/requests/update-skill-request.dto';

export interface IUpdateSkillUseCase {
  execute(skillId: string, dto: UpdateSkillRequestDto): Promise<Skill>;
}
