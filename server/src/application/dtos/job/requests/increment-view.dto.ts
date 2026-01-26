import { z } from 'zod';

export const IncrementJobViewCountDto = z.object({
  id: z.string().min(1, 'Job ID is required'),
  userRole: z.string().optional(),
});

export type IncrementJobViewCountDto = z.infer<typeof IncrementJobViewCountDto>;
