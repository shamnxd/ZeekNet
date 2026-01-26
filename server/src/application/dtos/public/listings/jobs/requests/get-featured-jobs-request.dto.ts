import { z } from 'zod';

export const GetFeaturedJobsRequestSchema = z.object({
  page: z.preprocess((val) => (val ? Number(val) : 1), z.number().int().min(1)).default(1),
  limit: z.preprocess((val) => (val ? Number(val) : 12), z.number().int().min(1).max(100)).default(12),
});

export type GetFeaturedJobsRequestDto = z.infer<typeof GetFeaturedJobsRequestSchema>;
