import { z } from 'zod';
import { BillingCycle } from '../../../../domain/enums/billing-cycle.enum';

export const ChangeSubscriptionPlanDto = z.object({
  userId: z.string().optional(),
  newPlanId: z.string().min(1, 'Plan ID is required'),
  billingCycle: z.nativeEnum(BillingCycle).optional(),
});

export type ChangeSubscriptionPlanRequestDto = z.infer<typeof ChangeSubscriptionPlanDto>;

