import { GetAllSkillsRequestDto } from 'src/application/dto/admin/skill-management.dto';
import { PaginatedSkills } from '../skills/PaginatedSkills';

export interface IGetAllSkillsUseCase {
  execute(options: GetAllSkillsRequestDto): Promise<PaginatedSkills>;
}
