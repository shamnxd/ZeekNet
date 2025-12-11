import { z } from 'zod';
import { commonValidations } from '../../../shared/validation/common';

const SocialLinkSchema = z.object({
  name: z.string().min(1, 'Social link name is required'),
  link: z.string().url('Please enter a valid URL'),
});

export const UpdateSeekerProfileRequestDtoSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  headline: z.string().max(100, 'Headline must not exceed 100 characters').optional(),
  summary: z.string().max(2000, 'Summary must not exceed 2000 characters').optional(),
  location: z.string().max(100, 'Location must not exceed 100 characters').optional(),
  phone: commonValidations.phoneNumber.optional(),
  email: commonValidations.email.optional(),
  dateOfBirth: z.string().date('Please enter a valid date of birth').optional(),
  gender: z.string().max(50, 'Gender must not exceed 50 characters').optional(),
  skills: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  socialLinks: z.array(SocialLinkSchema).optional(),
  name: z.string().min(1, 'Name is required').max(100, 'Name must not exceed 100 characters').optional(),
});

export type UpdateSeekerProfileRequestDto = z.infer<typeof UpdateSeekerProfileRequestDtoSchema>;

// Export for controller validation
export const UpdateSeekerProfileDto = UpdateSeekerProfileRequestDtoSchema;

