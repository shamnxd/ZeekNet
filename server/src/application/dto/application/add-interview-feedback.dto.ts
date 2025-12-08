import { z } from 'zod';

export const AddInterviewFeedbackDto = z.object({
  reviewer_name: z.string().min(1, 'Reviewer name is required').max(100, 'Reviewer name must not exceed 100 characters'),
  rating: z.number().min(0, 'Rating must be at least 0').max(5, 'Rating must be at most 5').optional(),
  comment: z.string().min(1, 'Feedback comment is required').max(2000, 'Comment must not exceed 2000 characters'),
});

