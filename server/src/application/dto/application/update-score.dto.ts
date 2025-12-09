import { z } from 'zod';

export const UpdateScoreDto = z.object({
  userId: z.string().optional(),
  applicationId: z.string().min(1, 'Application ID is required'),
  score: z.number().min(0, 'Score must be at least 0').max(5, 'Score must be at most 5'),
});

export type UpdateScoreRequestDto = z.infer<typeof UpdateScoreDto>;

