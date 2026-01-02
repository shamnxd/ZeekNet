import { z } from 'zod';
import { JobStatus } from 'src/domain/enums/job-status.enum';

export const GetAllJobsQueryDto = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  search: z.string().optional(),
  status: z.nativeEnum(JobStatus).optional(),
  category_ids: z.array(z.string()).optional(),
  employment_types: z.array(z.string()).optional(),
  salary_min: z.coerce.number().optional(),
  salary_max: z.coerce.number().optional(),
  location: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type GetAllJobsQueryDtoType = z.infer<typeof GetAllJobsQueryDto>;


export type GetAllJobsQueryRequestDto = z.infer<typeof GetAllJobsQueryDto>;
