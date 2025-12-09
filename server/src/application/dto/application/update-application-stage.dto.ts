import { z } from 'zod';

export const UpdateApplicationStageDto = z.object({
  userId: z.string().min(1, 'User ID is required'),
  applicationId: z.string().min(1, 'Application ID is required'),
  stage: z.enum(['applied', 'shortlisted', 'interview', 'rejected', 'hired']),
  rejectionReason: z.string().optional(),
});

export type UpdateApplicationStageRequestDto = z.infer<typeof UpdateApplicationStageDto>;
