import { SkillDto } from 'src/application/dtos/admin/attributes/skills/common/skill.dto';

export interface PaginatedSkillsResultDto {
  skills: SkillDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
