import { z } from 'zod';

export const PurchaseSubscriptionDto = z.object({
  planId: z.string().min(1, 'Plan ID is required'),
});

export type PurchaseSubscriptionRequestDto = z.infer<typeof PurchaseSubscriptionDto>;
