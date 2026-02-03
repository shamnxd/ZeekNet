import { z } from 'zod';

export const DeleteCompanyJobPostingDto = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  userId: z.string().min(1, 'User ID is required'),
});

export type DeleteCompanyJobPostingDto = z.infer<typeof DeleteCompanyJobPostingDto>;
