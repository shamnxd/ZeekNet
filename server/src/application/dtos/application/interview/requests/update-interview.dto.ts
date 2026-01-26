import { z } from 'zod';

export const UpdateInterviewRequestDtoSchema = z.object({
  interviewId: z.string().uuid('Interview ID must be a valid UUID'),
  status: z.enum(['scheduled', 'completed', 'cancelled']).optional(),
  rating: z.number().min(0).max(10).optional(),
  feedback: z.string().optional(),
  userId: z.string().uuid('User ID must be a valid UUID'),
});

export type UpdateInterviewRequestDto = z.infer<typeof UpdateInterviewRequestDtoSchema>;

// Alias for backward compatibility with controllers
export const UpdateInterviewDtoSchema = UpdateInterviewRequestDtoSchema;
export type UpdateInterviewDto = UpdateInterviewRequestDto;
