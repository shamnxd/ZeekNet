import { z } from 'zod';

export const UpdateApplicationStageDto = z.object({
  stage: z.enum(['applied', 'shortlisted', 'interview', 'rejected', 'hired'], {
    errorMap: () => ({ message: 'Invalid stage value' }),
  }),
  rejection_reason: z.string().max(1000, 'Rejection reason must not exceed 1000 characters').optional(),
});

