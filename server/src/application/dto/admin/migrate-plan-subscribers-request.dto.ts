import { z } from 'zod';

export const MigratePlanSubscribersRequestDtoSchema = z.object({
  planId: z.string().min(1, 'Plan ID is required'),
  billingCycle: z.enum(['monthly', 'yearly', 'both']).optional().default('both'),
  prorationBehavior: z.enum(['none', 'create_prorations', 'always_invoice']).optional().default('none'),
});

export type MigratePlanSubscribersRequestDto = z.infer<typeof MigratePlanSubscribersRequestDtoSchema>;

// Export for router validation
export const MigratePlanSubscribersDto = MigratePlanSubscribersRequestDtoSchema;

