import { z } from 'zod';

export const ChangeSubscriptionPlanDto = z.object({
  userId: z.string().optional(),
  newPlanId: z.string().min(1, 'Plan ID is required'),
  billingCycle: z.enum(['monthly', 'yearly']).optional(),
});

export type ChangeSubscriptionPlanRequestDto = z.infer<typeof ChangeSubscriptionPlanDto>;
