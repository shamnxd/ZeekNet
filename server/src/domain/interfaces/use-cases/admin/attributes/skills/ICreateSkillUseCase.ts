import { SkillResponseDto } from 'src/application/dtos/admin/attributes/skills/responses/skill-response.dto';
import { CreateSkillRequestDto } from 'src/application/dtos/admin/attributes/skills/requests/create-skill-request.dto';

export interface ICreateSkillUseCase {
  execute(dto: CreateSkillRequestDto): Promise<SkillResponseDto>;
}
