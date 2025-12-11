import { z } from 'zod';

export const UpdateJobStatusRequestDtoSchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  status: z.enum(['active', 'unlisted', 'expired', 'blocked']),
  unpublish_reason: z.string().optional(),
});

export type UpdateJobStatusRequestDto = z.infer<typeof UpdateJobStatusRequestDtoSchema>;

// Export for router validation
export const AdminUpdateJobStatusDto = UpdateJobStatusRequestDtoSchema;

