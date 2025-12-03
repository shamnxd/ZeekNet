import { z } from 'zod';

export const PurchaseSubscriptionDto = z.object({
  planId: z.string().min(1, 'Plan ID is required'),
  billingCycle: z.enum(['monthly', 'annual']).optional().default('monthly'),
});

export type PurchaseSubscriptionRequestDto = z.infer<typeof PurchaseSubscriptionDto>;
