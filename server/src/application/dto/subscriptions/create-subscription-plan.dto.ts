import { z } from 'zod';

export const CreateSubscriptionPlanDtoSchema = z.object({
  name: z.string().min(1, 'Plan name is required'),
  description: z.string().min(1, 'Plan description is required'),
  price: z.number().nonnegative().optional(),
  duration: z.number().int().positive().optional(),
  features: z.array(z.string()),
  jobPostLimit: z.number().int(),
  featuredJobLimit: z.number().int(),
  applicantAccessLimit: z.number().int(),
  yearlyDiscount: z.number().min(0).max(100).optional(),
  isPopular: z.boolean().optional(),
  isDefault: z.boolean().optional(),
});

export type CreateSubscriptionPlanDto = z.infer<typeof CreateSubscriptionPlanDtoSchema>;
