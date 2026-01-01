import { z } from 'zod';

export const GetApplicationDetailsDto = z.object({
  userId: z.string().min(1, 'User ID is required').optional(),
  seekerId: z.string().min(1, 'Seeker ID is required').optional(),
  applicationId: z.string().min(1, 'Application ID is required'),
}).refine(data => data.userId || data.seekerId, {
  message: 'Either userId or seekerId must be provided',
});

export type GetApplicationDetailsRequestDto = z.infer<typeof GetApplicationDetailsDto>;
