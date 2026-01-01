import { z } from 'zod';

export const GetBillingPortalDto = z.object({
  userId: z.string().optional(),
  returnUrl: z.string().url('Invalid return URL'),
});

export type GetBillingPortalRequestDto = z.infer<typeof GetBillingPortalDto>;
