import { z } from 'zod';

export const ApplicationFiltersDto = z.object({
  userId: z.string().min(1, 'User ID is required').optional(),
  job_id: z.string().optional(),
  stage: z.enum(['applied', 'shortlisted', 'interview', 'rejected', 'hired']).optional(),
  search: z.string().optional(),
  min_score: z.coerce.number().int().min(0).max(100).optional(),
  max_score: z.coerce.number().int().min(0).max(100).optional(),
  sort_by: z.enum(['applied_date', 'score']).optional().default('applied_date'),
  sort_order: z.enum(['asc', 'desc']).optional().default('desc'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type ApplicationFiltersRequestDto = z.infer<typeof ApplicationFiltersDto>;

