import { SkillResponseDto } from 'src/application/dtos/admin/attributes/skills/responses/skill-response.dto';
import { UpdateSkillRequestDto } from 'src/application/dtos/admin/attributes/skills/requests/update-skill-request.dto';

export interface IUpdateSkillUseCase {
  execute(skillId: string, dto: UpdateSkillRequestDto): Promise<SkillResponseDto>;
}
