import { z } from 'zod';

import { JobStatus } from '../../../domain/enums/job-status.enum';

const JobStatusSchema = z.nativeEnum(JobStatus);

export const UpdateJobStatusDtoSchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  status: JobStatusSchema,
  userId: z.string().optional(),
});

export type UpdateJobStatusDto = z.infer<typeof UpdateJobStatusDtoSchema>;

