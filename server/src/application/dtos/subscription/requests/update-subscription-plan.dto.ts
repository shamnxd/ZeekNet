import { z } from 'zod';

export const UpdateSubscriptionPlanDtoSchema = z.object({
  planId: z.string().min(1, 'Plan ID is required'),
  name: z.string().min(1, 'Plan name is required').optional(),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be non-negative').optional(),
  duration: z.number().int().min(0, 'Duration must be non-negative').optional(),
  features: z.array(z.string()).optional(),
  jobPostLimit: z.number().int().min(-1, 'Job post limit must be -1 or greater').optional(),
  featuredJobLimit: z.number().int().min(-1, 'Featured job limit must be -1 or greater').optional(),
  applicantAccessLimit: z.number().int().min(-1, 'Applicant access limit must be -1 or greater').optional(),
  yearlyDiscount: z.number().min(0).max(100, 'Yearly discount must be between 0 and 100').optional(),
  isActive: z.boolean().optional(),
  isPopular: z.boolean().optional(),
  isDefault: z.boolean().optional(),
});

export type UpdateSubscriptionPlanDto = z.infer<typeof UpdateSubscriptionPlanDtoSchema>;

