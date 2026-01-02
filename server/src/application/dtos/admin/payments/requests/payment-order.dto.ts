import { z } from 'zod';

export const GetAllPaymentOrdersDto = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  status: z.enum(['pending', 'completed', 'failed', 'cancelled', 'refunded']).optional(),
  search: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type GetAllPaymentOrdersRequestDto = z.infer<typeof GetAllPaymentOrdersDto>;
