import { z } from 'zod';

export const CreateJobApplicationDto = z.object({
  job_id: z.string().min(1, 'Job ID is required'),
  cover_letter: z
    .string()
    .min(50, 'Cover letter must be at least 50 characters')
    .max(5000, 'Cover letter must not exceed 5000 characters'),
  resume_url: z.string().min(1, 'Resume URL is required'),
  resume_filename: z.string().min(1, 'Resume filename is required'),
});


export type CreateJobApplicationRequestDto = z.infer<typeof CreateJobApplicationDto>;
