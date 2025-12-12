import { z } from 'zod';

export const GetAllSubscriptionPlansQueryDtoSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  search: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type GetAllSubscriptionPlansQueryDto = z.infer<typeof GetAllSubscriptionPlansQueryDtoSchema>;

// Export for router validation
export const GetAllSubscriptionPlansDto = GetAllSubscriptionPlansQueryDtoSchema;

