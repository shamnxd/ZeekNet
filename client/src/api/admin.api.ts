import { api } from './index';
import type { JobPostingResponse } from '@/interfaces/job/job-posting-response.interface';
import type { JobPostingQuery } from '@/interfaces/job/job-posting-query.interface';
import type { PaginatedJobPostings } from '@/interfaces/job/paginated-job-postings.interface';
import { AdminRoutes } from '@/constants/api-routes';
import type { ApiError } from '@/types/api-error.type';
import type { User, GetAllUsersParams } from '@/interfaces/admin/admin-user.interface';
import type { Company, GetAllCompaniesParams } from '@/interfaces/admin/admin-company.interface';
import type { JobCategory, GetAllJobCategoriesParams } from '@/interfaces/job/job-category.interface';
import type { JobRole, GetAllJobRolesParams } from '@/interfaces/job/job-role.interface';
import type { Skill, GetAllSkillsParams } from '@/interfaces/job/skill.interface';
import type {
  SubscriptionPlan,
  GetAllSubscriptionPlansParams,
  CreateSubscriptionPlanData,
  UpdateSubscriptionPlanData
} from '@/interfaces/admin/subscription-plan.interface';
import type { PaymentOrder, GetAllPaymentOrdersParams } from '@/interfaces/admin/payment-order.interface';
import type { AdminStats } from '@/interfaces/admin/admin-stats.interface';
import type { AdminDashboardStats } from '@/interfaces/admin/admin-dashboard-stats.interface';

export const adminApi = {
  getAllJobs: async (query: JobPostingQuery & {
    status?: 'all' | 'active' | 'inactive' | 'blocked' | 'unlisted' | 'expired';
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<{
    success: boolean;
    data?: PaginatedJobPostings;
    message?: string;
  }> => {
    try {
      const params = new URLSearchParams();

      if (query.page) params.append('page', query.page.toString());
      if (query.limit) params.append('limit', query.limit.toString());
      if (query.category_ids?.length) params.append('category_ids', query.category_ids.join(','));
      if (query.employment_types?.length) params.append('employment_types', query.employment_types.join(','));
      if (query.salary_min) params.append('salary_min', query.salary_min.toString());
      if (query.salary_max) params.append('salary_max', query.salary_max.toString());
      if (query.location) params.append('location', query.location);
      if (query.search) params.append('search', query.search);
      if (query.status) {
        params.append('status', query.status);
      }
      if (query.sortBy) params.append('sortBy', query.sortBy);
      if (query.sortOrder) params.append('sortOrder', query.sortOrder);

      const endpoint = params.toString() ? `${AdminRoutes.JOBS}?${params.toString()}` : AdminRoutes.JOBS;
      const response = await api.get(endpoint);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || 'Failed to fetch jobs',
      };
    }
  },

  getJobById: async (id: string): Promise<{
    success: boolean;
    data?: JobPostingResponse;
    message?: string;
  }> => {
    try {
      const response = await api.get(AdminRoutes.JOBS_ID.replace(':id', id));
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || 'Failed to fetch job',
      };
    }
  },

  updateJobStatus: async (jobId: string, status: 'active' | 'unlisted' | 'expired' | 'blocked', unpublishReason?: string): Promise<{
    success: boolean;
    message?: string;
  }> => {
    try {
      const response = await api.patch(AdminRoutes.JOBS_ID_STATUS.replace(':id', jobId), {
        status: status,
        unpublish_reason: unpublishReason
      });
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || 'Failed to update job status',
      };
    }
  },

  deleteJob: async (jobId: string): Promise<{
    success: boolean;
    message?: string;
  }> => {
    try {
      const response = await api.delete(AdminRoutes.JOBS_ID.replace(':id', jobId));
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || 'Failed to delete job',
      };
    }
  },

  getJobStats: async (): Promise<{
    success: boolean;
    data?: AdminStats;
    message?: string;
  }> => {
    try {
      const response = await api.get(AdminRoutes.JOBS_STATS);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || 'Failed to fetch job statistics',
      };
    }
  },

  getAllUsers: async (query: GetAllUsersParams = {} as GetAllUsersParams): Promise<{
    success: boolean;
    data?: {
      users: User[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    message?: string;
  }> => {
    try {
      const params = new URLSearchParams();

      if (query.page) params.append('page', query.page.toString());
      if (query.limit) params.append('limit', query.limit.toString());
      if (query.search) params.append('search', query.search);
      if (query.role) params.append('role', query.role);
      if (query.isBlocked !== undefined) {
        const blocked = typeof query.isBlocked === 'string' ? query.isBlocked : query.isBlocked.toString();
        params.append('isBlocked', blocked);
      }

      const response = await api.get(`${AdminRoutes.USERS}?${params.toString()}`);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error('API Error:', apiError.response || apiError);
      return {
        success: false,
        message: apiError.response?.data?.message || 'Failed to fetch users',
      };
    }
  },

  getUserById: async (userId: string): Promise<{
    success: boolean;
    data?: User;
    message?: string;
  }> => {
    try {
      const response = await api.get(AdminRoutes.USERS_ID.replace(':id', userId));
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || 'Failed to fetch user',
      };
    }
  },

  blockUser: async (userId: string, isBlocked: boolean): Promise<{
    success: boolean;
    message?: string;
  }> => {
    try {
      const response = await api.patch(AdminRoutes.USERS_BLOCK, {
        userId,
        isBlocked
      });
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || 'Failed to update user status',
      };
    }
  },

  getAllCompanies: async (query: GetAllCompaniesParams): Promise<{
    success: boolean;
    data?: {
      companies: Company[];
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    message?: string;
  }> => {
    try {
      const params = new URLSearchParams();

      if (query.page) params.append('page', query.page.toString());
      if (query.limit) params.append('limit', query.limit.toString());
      if (query.search) params.append('search', query.search);
      if (query.industry) params.append('industry', query.industry);
      if (query.isVerified) params.append('isVerified', query.isVerified);
      if (query.isBlocked !== undefined) params.append('isBlocked', query.isBlocked.toString());

      const response = await api.get(`${AdminRoutes.COMPANIES}?${params.toString()}`);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || 'Failed to fetch companies',
      };
    }
  },

  getPendingCompanies: async (): Promise<{
    success: boolean;
    data?: {
      companies: Company[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    message?: string;
  }> => {
    try {
      const response = await api.get(AdminRoutes.COMPANIES_VERIFICATION);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || 'Failed to fetch pending companies',
      };
    }
  },

  getCompanyById: async (companyId: string): Promise<{
    success: boolean;
    data?: Company;
    message?: string;
  }> => {
    try {
      const response = await api.get(AdminRoutes.COMPANIES_VERIFICATION.replace('verification', companyId));
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || 'Failed to fetch company',
      };
    }
  },

  verifyCompany: async (data: { companyId: string; isVerified: string; rejection_reason?: string }): Promise<{
    success: boolean;
    message?: string;
  }> => {
    try {
      const response = await api.patch(AdminRoutes.COMPANIES_VERIFY, data);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || 'Failed to verify company',
      };
    }
  },

  getAllSkills: async (params: GetAllSkillsParams = {}): Promise<{
    success: boolean;
    data?: {
      skills: Skill[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    message?: string;
  }> => {
    try {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const response = await api.get(`${AdminRoutes.SKILLS}?${queryParams.toString()}`);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || 'Failed to fetch skills',
      };
    }
  },

  createSkill: async (data: { name: string }): Promise<{
    success: boolean;
    data?: Skill;
    message?: string;
  }> => {
    try {
      const response = await api.post(AdminRoutes.SKILLS, data);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || 'Failed to create skill',
      };
    }
  },

  updateSkill: async (id: string, data: { name: string }): Promise<{
    success: boolean;
    data?: Skill;
    message?: string;
  }> => {
    try {
      const response = await api.put(AdminRoutes.SKILLS_ID.replace(':id', id), data);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || 'Failed to update skill',
      };
    }
  },

  deleteSkill: async (id: string): Promise<{
    success: boolean;
    message?: string;
  }> => {
    try {
      const response = await api.delete(AdminRoutes.SKILLS_ID.replace(':id', id));
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || 'Failed to delete skill',
      };
    }
  },

  getAllJobCategories: async (params: GetAllJobCategoriesParams = {}): Promise<{
    success: boolean;
    data?: {
      categories: JobCategory[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    message?: string;
  }> => {
    try {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);

      const response = await api.get(`${AdminRoutes.JOB_CATEGORIES}?${queryParams.toString()}`);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || 'Failed to fetch job categories',
      };
    }
  },

  createJobCategory: async (data: { name: string }): Promise<{
    success: boolean;
    data?: JobCategory;
    message?: string;
  }> => {
    try {
      const response = await api.post(AdminRoutes.JOB_CATEGORIES, data);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || 'Failed to create job category',
      };
    }
  },

  updateJobCategory: async (id: string, data: { name: string }): Promise<{
    success: boolean;
    data?: JobCategory;
    message?: string;
  }> => {
    try {
      const response = await api.put(AdminRoutes.JOB_CATEGORIES_ID.replace(':id', id), data);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || 'Failed to update job category',
      };
    }
  },

  deleteJobCategory: async (id: string): Promise<{
    success: boolean;
    message?: string;
  }> => {
    try {
      const response = await api.delete(AdminRoutes.JOB_CATEGORIES_ID.replace(':id', id));
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || 'Failed to delete job category',
      };
    }
  },

  getAllJobRoles: async (params: GetAllJobRolesParams = {}): Promise<{
    success: boolean;
    data?: {
      roles: JobRole[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    message?: string;
  }> => {
    try {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const response = await api.get(`${AdminRoutes.JOB_ROLES}?${queryParams.toString()}`);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || 'Failed to fetch job roles',
      };
    }
  },

  createJobRole: async (data: { name: string }): Promise<{
    success: boolean;
    data?: JobRole;
    message?: string;
  }> => {
    try {
      const response = await api.post(AdminRoutes.JOB_ROLES, data);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || 'Failed to create job role',
      };
    }
  },

  updateJobRole: async (id: string, data: { name: string }): Promise<{
    success: boolean;
    data?: JobRole;
    message?: string;
  }> => {
    try {
      const response = await api.put(AdminRoutes.JOB_ROLES_ID.replace(':id', id), data);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || 'Failed to update job role',
      };
    }
  },

  deleteJobRole: async (id: string): Promise<{
    success: boolean;
    message?: string;
  }> => {
    try {
      const response = await api.delete(AdminRoutes.JOB_ROLES_ID.replace(':id', id));
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || 'Failed to delete job role',
      };
    }
  },

  getAllSubscriptionPlans: async (params: GetAllSubscriptionPlansParams = {}): Promise<{
    success: boolean;
    data?: {
      plans: SubscriptionPlan[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    message?: string;
  }> => {
    try {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const response = await api.get(`${AdminRoutes.SUBSCRIPTION_PLANS}?${queryParams.toString()}`);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || 'Failed to fetch subscription plans',
      };
    }
  },

  createSubscriptionPlan: async (data: CreateSubscriptionPlanData): Promise<{
    success: boolean;
    data?: SubscriptionPlan;
    message?: string;
  }> => {
    try {
      const response = await api.post(AdminRoutes.SUBSCRIPTION_PLANS, data);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || 'Failed to create subscription plan',
      };
    }
  },

  updateSubscriptionPlan: async (id: string, data: UpdateSubscriptionPlanData): Promise<{
    success: boolean;
    data?: SubscriptionPlan;
    message?: string;
  }> => {
    try {
      const response = await api.put(AdminRoutes.SUBSCRIPTION_PLANS_ID.replace(':id', id), data);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || 'Failed to update subscription plan',
      };
    }
  },

  migratePlanSubscribers: async (planId: string, options: {
    billingCycle?: 'monthly' | 'yearly' | 'both';
    prorationBehavior?: 'none' | 'create_prorations' | 'always_invoice';
  } = {}): Promise<{
    success: boolean;
    data?: {
      migratedCount: number;
      failedCount: number;
    };
    message?: string;
  }> => {
    try {
      const response = await api.post(AdminRoutes.SUBSCRIPTION_PLANS_MIGRATE.replace(':id', planId), options);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || 'Failed to migrate subscribers',
      };
    }
  },

  getPaymentOrders: async (query: GetAllPaymentOrdersParams = {}): Promise<{
    success: boolean;
    data?: {
      orders: PaymentOrder[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    message?: string;
  }> => {
    try {
      const params = new URLSearchParams();

      if (query.page) params.append('page', query.page.toString());
      if (query.limit) params.append('limit', query.limit.toString());
      if (query.status) params.append('status', query.status);
      if (query.search) params.append('search', query.search);
      if (query.sortOrder) params.append('sortOrder', query.sortOrder);

      const response = await api.get(`${AdminRoutes.PAYMENT_ORDERS}?${params.toString()}`);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || 'Failed to fetch payment orders',
      };
    }
  },

  getDashboardStats: async (params?: {
    period?: 'day' | 'week' | 'month' | 'year';
    startDate?: string;
    endDate?: string;
  }): Promise<{
    success: boolean;
    data?: AdminDashboardStats;
    message?: string;
  }> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.period) queryParams.append('period', params.period);
      if (params?.startDate) queryParams.append('startDate', params.startDate);
      if (params?.endDate) queryParams.append('endDate', params.endDate);

      const url = queryParams.toString()
        ? `${AdminRoutes.DASHBOARD_STATS}?${queryParams.toString()}`
        : AdminRoutes.DASHBOARD_STATS;

      const response = await api.get(url);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: apiError.response?.data?.message || 'Failed to fetch dashboard stats',
      };
    }
  }
};
