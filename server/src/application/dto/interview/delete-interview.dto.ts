import { z } from 'zod';

export const DeleteInterviewDtoSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  applicationId: z.string().min(1, 'Application ID is required'),
  interviewId: z.string().min(1, 'Interview ID is required'),
});

export type DeleteInterviewDto = z.infer<typeof DeleteInterviewDtoSchema>;

