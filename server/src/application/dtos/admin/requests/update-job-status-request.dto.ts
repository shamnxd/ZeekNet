import { z } from 'zod';
import { JobStatus } from '../../../../domain/enums/job-status.enum';

export const UpdateJobStatusRequestDtoSchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  status: z.nativeEnum(JobStatus),
  unpublish_reason: z.string().optional(),
});

export type UpdateJobStatusRequestDto = z.infer<typeof UpdateJobStatusRequestDtoSchema>;


export const AdminUpdateJobStatusDto = UpdateJobStatusRequestDtoSchema;


