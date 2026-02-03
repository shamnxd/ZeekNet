import { z } from 'zod';
export const GetAllJobCategoriesQueryDto = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});
export type GetAllJobCategoriesQueryDto = z.infer<typeof GetAllJobCategoriesQueryDto>;