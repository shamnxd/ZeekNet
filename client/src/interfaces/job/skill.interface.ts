export interface Skill {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllSkillsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
