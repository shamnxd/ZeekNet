import { GetAllSkillsRequestDto } from 'src/application/dto/admin/skill-management.dto';
import { PaginatedSkillsResultDto } from 'src/application/dto/skills/paginated-skills-result.dto';

export interface IGetAllSkillsUseCase {
  execute(options: GetAllSkillsRequestDto): Promise<PaginatedSkillsResultDto>;
}
