import { z } from 'zod';

export const UpdateInterviewParamsDto = z.object({
  applicationId: z.string().min(1, 'Application ID is required'),
  interviewId: z.string().min(1, 'Interview ID is required'),
});

export type UpdateInterviewParamsRequestDto = z.infer<typeof UpdateInterviewParamsDto>;
