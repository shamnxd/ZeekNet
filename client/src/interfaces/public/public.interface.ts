
export interface GetAllSkillsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface GetAllJobCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetAllJobRolesParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
