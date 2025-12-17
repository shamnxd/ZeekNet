import { z } from 'zod';

export const AddInterviewDto = z.object({
  interview_date: z.string().min(1, 'Interview date is required'),
  interview_time: z.string().min(1, 'Interview time is required'),
  interview_type: z.enum(['phone', 'video', 'in-person', 'other']),
  location: z.string().optional(),
  notes: z.string().optional(),
  interviewer_name: z.string().optional(),
  interviewer_email: z.string().email().optional(),
});






