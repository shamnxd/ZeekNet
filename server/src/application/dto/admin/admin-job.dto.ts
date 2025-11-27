import { z } from 'zod';

export const AdminGetAllJobsDto = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
  search: z.string().optional(),
  is_active: z.preprocess(
    (val) => {
      if (val === 'true') return true;
      if (val === 'false') return false;
      if (typeof val === 'boolean') return val;
      return undefined;
    },
    z.boolean().optional(),
  ),
  admin_blocked: z.preprocess(
    (val) => {
      if (val === 'true') return true;
      if (val === 'false') return false;
      if (typeof val === 'boolean') return val;
      return undefined;
    },
    z.boolean().optional(),
  ),
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

export const AdminUpdateJobStatusDto = z.object({
  is_active: z.boolean(),
  unpublish_reason: z.string().optional(),
});

export type AdminGetAllJobsDtoType = z.infer<typeof AdminGetAllJobsDto>;