import { z } from 'zod';

export const CloseJobDto = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  userId: z.string().min(1, 'User ID is required'),
});

export type CloseJobDto = z.infer<typeof CloseJobDto>;
