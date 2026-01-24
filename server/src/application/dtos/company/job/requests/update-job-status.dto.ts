import { z } from 'zod';
import { JobStatus } from 'src/domain/enums/job-status.enum';

export const UpdateJobStatusDto = z.object({
    status: z.nativeEnum(JobStatus),
});

export type UpdateJobStatusRequestDto = z.infer<typeof UpdateJobStatusDto>;
