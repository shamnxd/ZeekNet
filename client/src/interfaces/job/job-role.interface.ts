export interface JobRole {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllJobRolesParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
