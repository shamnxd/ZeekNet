import { api } from './index';

interface GetAllSkillsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface GetAllJobCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface GetAllJobRolesParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const publicApi = {
  getAllSkills: async (params: GetAllSkillsParams = {}): Promise<{
    success: boolean;
    data?: string[];
    message?: string;
  }> => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const response = await api.get(`/api/public/skills?${queryParams.toString()}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch skills',
      };
    }
  },

  getAllJobCategories: async (params: GetAllJobCategoriesParams = {}): Promise<{
    success: boolean;
    data?: string[];
    message?: string;
  }> => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);

      const response = await api.get(`/api/public/job-categories?${queryParams.toString()}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch job categories',
      };
    }
  },

  getAllJobRoles: async (params: GetAllJobRolesParams = {}): Promise<{
    success: boolean;
    data?: string[];
    message?: string;
  }> => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const response = await api.get(`/api/public/job-roles?${queryParams.toString()}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch job roles',
      };
    }
  },
};

