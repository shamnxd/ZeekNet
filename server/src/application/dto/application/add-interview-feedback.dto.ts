import { z } from 'zod';

export const AddInterviewFeedbackParamsDto = z.object({
  applicationId: z.string().min(1, 'Application ID is required'),
  interviewId: z.string().min(1, 'Interview ID is required'),
});

export type AddInterviewFeedbackParamsRequestDto = z.infer<typeof AddInterviewFeedbackParamsDto>;
