import { Skill } from '../../../domain/entities/skill.entity';

export interface PaginatedSkillsResultDto {
  skills: Skill[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

