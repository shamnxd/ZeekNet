import { z } from 'zod';

export const UpdateInterviewParamsDto = z.object({
  applicationId: z.string().min(1, 'Application ID is required'),
  interviewId: z.string().min(1, 'Interview ID is required'),
});

export const UpdateInterviewDto = z.object({
  interview_id: z.string().min(1, 'Interview ID is required').optional(),
  interview_date: z.string().optional(),
  interview_time: z.string().optional(),
  interview_type: z.enum(['phone', 'video', 'in-person', 'other']).optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
  interviewer_name: z.string().optional(),
  interviewer_email: z.string().email().optional(),
  status: z.enum(['scheduled', 'completed', 'cancelled', 'no-show']).optional(),
});

export type UpdateInterviewRequestDto = z.infer<typeof UpdateInterviewDto>;
export type UpdateInterviewParamsRequestDto = z.infer<typeof UpdateInterviewParamsDto>;
