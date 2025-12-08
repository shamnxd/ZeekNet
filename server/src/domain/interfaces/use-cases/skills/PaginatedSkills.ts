import { Skill } from 'src/domain/entities/skill.entity';


export interface PaginatedSkills {
  skills: Skill[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
