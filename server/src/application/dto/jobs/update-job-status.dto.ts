import { z } from 'zod';

const JobStatusSchema = z.enum(['active', 'unlisted', 'expired', 'blocked']);

export const UpdateJobStatusDtoSchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  status: JobStatusSchema,
  userId: z.string().optional(),
});

export type UpdateJobStatusDto = z.infer<typeof UpdateJobStatusDtoSchema>;

