export interface JobCategory {
  id: string;
  name: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllJobCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
}
