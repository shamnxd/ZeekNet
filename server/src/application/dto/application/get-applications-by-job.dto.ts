import { z } from 'zod';

export const GetApplicationsByJobDto = z.object({
  userId: z.string().min(1, 'User ID is required'),
  jobId: z.string().min(1, 'Job ID is required'),
  stage: z.enum(['applied', 'shortlisted', 'interview', 'rejected', 'hired']).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type GetApplicationsByJobRequestDto = z.infer<typeof GetApplicationsByJobDto>;
