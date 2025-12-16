import { z } from 'zod';

const JobStatusSchema = z.enum(['active', 'unlisted', 'expired', 'blocked']);

export const JobPostingFiltersDtoSchema = z.object({
  status: JobStatusSchema.optional(),
  categoryIds: z.array(z.string()).optional(),
  employmentTypes: z.array(z.string()).optional(),
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional(),
  companyId: z.string().optional(),
  location: z.string().optional(),
  search: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export type JobPostingFiltersDto = z.infer<typeof JobPostingFiltersDtoSchema>;

// Legacy type for backward compatibility
export interface JobPostingFilters {
  status?: 'active' | 'unlisted' | 'expired' | 'blocked';
  categoryIds?: string[];
  employmentTypes?: string[];
  salaryMin?: number;
  salaryMax?: number;
  companyId?: string;
  location?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedJobPostings<T = unknown> {
  jobs: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

