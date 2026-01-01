import { z } from 'zod';
import { InterviewStatus } from '../../../../domain/interfaces/interview.interfaces';

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
  status: z.nativeEnum(InterviewStatus).optional(),
});


