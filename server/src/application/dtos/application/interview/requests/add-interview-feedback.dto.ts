import { z } from 'zod';

export const AddInterviewFeedbackParamsDto = z.object({
  applicationId: z.string().min(1, 'Application ID is required'),
  interviewId: z.string().min(1, 'Interview ID is required'),
});

export const AddInterviewFeedbackDto = z.object({
  interview_id: z.string().min(1, 'Interview ID is required').optional(),
  reviewer_name: z.string().min(1, 'Reviewer name is required'),
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().min(1, 'Comment is required'),
});


export type AddInterviewFeedbackParamsRequestDto = z.infer<typeof AddInterviewFeedbackParamsDto>;
export type AddInterviewFeedbackRequestDto = z.infer<typeof AddInterviewFeedbackDto>;
