import { z } from 'zod';
import { BillingCycle } from '../../../../domain/enums/billing-cycle.enum';

export const CreateCheckoutSessionDto = z.object({
  userId: z.string().optional(),
  planId: z.string().min(1, 'Plan ID is required'),
  billingCycle: z.nativeEnum(BillingCycle, {
    required_error: 'Billing cycle is required',
    invalid_type_error: 'Billing cycle must be either monthly or yearly',
  }),
  successUrl: z.string().url('Invalid success URL'),
  cancelUrl: z.string().url('Invalid cancel URL'),
});

export type CreateCheckoutSessionRequestDto = z.infer<typeof CreateCheckoutSessionDto>;

