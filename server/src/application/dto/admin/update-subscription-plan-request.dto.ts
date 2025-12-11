import { z } from 'zod';

export const UpdateSubscriptionPlanRequestDtoSchema = z.object({
  planId: z.string().min(1, 'Plan ID is required'),
  name: z.string().min(1, 'Plan name cannot be empty').max(100, 'Plan name must be less than 100 characters').trim().optional(),
  description: z.string().min(1, 'Plan description cannot be empty').max(500, 'Plan description must be less than 500 characters').trim().optional(),
  price: z.number().min(0, 'Price must be a positive number').optional(),
  duration: z.number().int().min(1, 'Duration must be at least 1 day').optional(),
  features: z.array(z.string()).min(1, 'At least one feature is required').optional(),
  jobPostLimit: z.number().int().min(0, 'Job post limit must be a positive number').optional(),
  featuredJobLimit: z.number().int().min(0, 'Featured job limit must be a positive number').optional(),
  applicantAccessLimit: z.number().int().min(0, 'Applicant access limit must be a positive number').optional(),
  yearlyDiscount: z.number().min(0, 'Discount must be at least 0').max(100, 'Discount cannot exceed 100%').optional(),
  isActive: z.boolean().optional(),
  isPopular: z.boolean().optional(),
  isDefault: z.boolean().optional(),
}).refine((data) => {
  if (data.isDefault && data.price !== undefined && data.price !== 0) {
    return false;
  }
  return true;
}, {
  message: 'Default plan must have price of 0',
  path: ['price'],
});

export type UpdateSubscriptionPlanRequestDto = z.infer<typeof UpdateSubscriptionPlanRequestDtoSchema>;

// Export for router validation
export const UpdateSubscriptionPlanDto = UpdateSubscriptionPlanRequestDtoSchema;

