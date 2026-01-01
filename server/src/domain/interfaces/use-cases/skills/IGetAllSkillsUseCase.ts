import { GetAllSkillsRequestDto } from 'src/application/dtos/admin/common/skill-management.dto';
import { PaginatedSkillsResultDto } from 'src/application/dtos/skills/common/paginated-skills-result.dto';

export interface IGetAllSkillsUseCase {
  execute(options: GetAllSkillsRequestDto): Promise<PaginatedSkillsResultDto>;
}

