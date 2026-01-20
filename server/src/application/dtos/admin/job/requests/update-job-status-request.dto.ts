import { z } from 'zod';
import { JobStatus } from 'src/domain/enums/job-status.enum';

export const UpdateJobStatusRequestDtoSchema = z.object({
  status: z.nativeEnum(JobStatus),
  unpublish_reason: z.string().optional(),
});

export type UpdateJobStatusRequestDto = z.infer<typeof UpdateJobStatusRequestDtoSchema>;
