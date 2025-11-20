import { Skill } from '../../../entities/skill.entity';
import { IBaseRepository } from '../IBaseRepository';

export interface SkillQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedSkills {
  skills: Skill[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ISkillRepository extends IBaseRepository<Skill> {
  // Special method with case-insensitive regex matching
  findByName(name: string): Promise<Skill | null>;
  // Complex pagination query
  findAllWithPagination(filters?: SkillQueryFilters): Promise<PaginatedSkills>;
}