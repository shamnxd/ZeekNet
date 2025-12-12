import { z } from 'zod';

export const GetCompaniesQueryDtoSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).optional().default(10),
  search: z.string().optional(),
  isVerified: z.enum(['pending', 'rejected', 'verified']).optional(),
  isBlocked: z.coerce.boolean().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type GetCompaniesQueryDto = z.infer<typeof GetCompaniesQueryDtoSchema>;

