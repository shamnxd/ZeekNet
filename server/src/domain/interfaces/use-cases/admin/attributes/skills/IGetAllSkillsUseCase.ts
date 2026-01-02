import { GetAllSkillsRequestDto } from 'src/application/dtos/admin/attributes/skills/requests/get-all-skills-query.dto';
import { PaginatedSkillsResultDto } from 'src/application/dtos/admin/attributes/skills/responses/paginated-skills-result.dto';

export interface IGetAllSkillsUseCase {
  execute(options: GetAllSkillsRequestDto): Promise<PaginatedSkillsResultDto>;
}

