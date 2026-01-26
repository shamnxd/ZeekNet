import { z } from 'zod';
import { UpdateJobPostingRequestDtoSchema } from 'src/application/dtos/admin/job/requests/update-job-posting-request.dto';

export const UpdateCompanyJobPostingDto = UpdateJobPostingRequestDtoSchema.extend({
  jobId: z.string().min(1, 'Job ID is required'),
  userId: z.string().min(1, 'User ID is required'),
});

export type UpdateCompanyJobPostingDto = z.infer<typeof UpdateCompanyJobPostingDto>;
