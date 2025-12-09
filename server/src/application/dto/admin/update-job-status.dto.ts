import { z } from 'zod';

export const UpdateJobStatusDto = z.object({
  status: z.string().min(1, 'Status is required'),
  userId: z.string().optional(),
});

export type UpdateJobStatusRequestDto = z.infer<typeof UpdateJobStatusDto>;
