import { SkillResponseDto } from 'src/application/dtos/admin/attributes/skills/responses/skill-response.dto';

export interface IGetSkillByIdUseCase {
  execute(skillId: string): Promise<SkillResponseDto>;
}
