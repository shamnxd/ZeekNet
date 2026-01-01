import { z } from 'zod';

export const UpdateApplicationScoreDtoSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  applicationId: z.string().min(1, 'Application ID is required'),
  score: z.number().min(0, 'Score must be non-negative').max(100, 'Score must not exceed 100'),
});

export type UpdateApplicationScoreDto = z.infer<typeof UpdateApplicationScoreDtoSchema>;

