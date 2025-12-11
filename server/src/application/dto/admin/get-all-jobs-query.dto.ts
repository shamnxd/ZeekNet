import { z } from 'zod';

export const GetAllJobsQueryDtoSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
  search: z.string().optional(),
  status: z.enum(['active', 'unlisted', 'expired', 'blocked']).optional(),
  category_ids: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(',') : undefined)),
  employment_types: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(',') : undefined)),
  salary_min: z.coerce.number().min(0).optional(),
  salary_max: z.coerce.number().min(0).optional(),
  location: z.string().optional(),
  sortBy: z.enum(['createdAt', 'title', 'application_count', 'view_count']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type GetAllJobsQueryDto = z.infer<typeof GetAllJobsQueryDtoSchema>;

// Export for router validation
export const AdminGetAllJobsDto = GetAllJobsQueryDtoSchema;

export type AdminGetAllJobsDtoType = GetAllJobsQueryDto;

