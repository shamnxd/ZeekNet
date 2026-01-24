import { z } from 'zod';

export const GetJobPostingDto = z.object({
    id: z.string().min(1, 'Job ID is required'),
});

export type GetJobPostingRequestDto = z.infer<typeof GetJobPostingDto>;
