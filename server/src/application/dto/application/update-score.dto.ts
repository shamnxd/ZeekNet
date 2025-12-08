import { z } from 'zod';

export const UpdateScoreDto = z.object({
  score: z.number().min(0, 'Score must be at least 0').max(5, 'Score must be at most 5'),
});

