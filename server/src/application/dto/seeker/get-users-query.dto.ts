import { z } from 'zod';

export const GetUsersQueryDtoSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).optional().default(10),
  search: z.string().optional(),
  role: z.string().optional(),
  isBlocked: z.coerce.boolean().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type GetUsersQueryDto = z.infer<typeof GetUsersQueryDtoSchema>;

