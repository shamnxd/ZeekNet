import { z } from 'zod';

export const ReopenJobDto = z.object({
  additionalVacancies: z.number().int().min(1, 'additionalVacancies must be at least 1'),
});

export type ReopenJobRequestDto = z.infer<typeof ReopenJobDto>;
