import { z } from 'zod';

export const CreateSubscriptionPlanRequestDtoSchema = z.object({
  name: z.string().min(1, 'Plan name is required').max(100, 'Plan name must be less than 100 characters').trim(),
  description: z.string().min(1, 'Plan description is required').max(500, 'Plan description must be less than 500 characters').trim(),
  price: z.number().min(0, 'Price must be a positive number'),
  duration: z.number().int().min(1, 'Duration must be at least 1 day'),
  features: z.array(z.string()).min(1, 'At least one feature is required'),
  jobPostLimit: z.number().int().min(0, 'Job post limit must be a positive number'),
  featuredJobLimit: z.number().int().min(0, 'Featured job limit must be a positive number'),
  applicantAccessLimit: z.number().int().min(0, 'Applicant access limit must be a positive number'),
  yearlyDiscount: z.number().min(0, 'Discount must be at least 0').max(100, 'Discount cannot exceed 100%'),
  isPopular: z.boolean().optional(),
  isDefault: z.boolean().optional(),
}).refine((data) => {
  if (data.isDefault && data.price !== 0) {
    return false;
  }
  return true;
}, {
  message: 'Default plan must have price of 0',
  path: ['price'],
});

export type CreateSubscriptionPlanRequestDto = z.infer<typeof CreateSubscriptionPlanRequestDtoSchema>;

// Export for router validation
export const CreateSubscriptionPlanDto = CreateSubscriptionPlanRequestDtoSchema;

