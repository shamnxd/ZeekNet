import { z } from 'zod';
import { commonValidations } from '../../../shared/validation/common';

export const CreateCompanyOfficeLocationDto = z.object({
  companyId: z.string().min(1, 'Company ID is required').optional(),
  location: z.string().min(1, 'Location cannot be empty'),
  officeName: z.string().optional(),
  address: z.string().optional(),
  isHeadquarters: z.boolean().default(false),
});

export const UpdateCompanyOfficeLocationDto = z.object({
  companyId: z.string().min(1, 'Company ID is required'),
  locationId: z.string().min(1, 'Location ID is required'),
  location: z.string().min(1, 'Location cannot be empty').optional(),
  officeName: z.string().optional(),
  address: z.string().optional(),
  isHeadquarters: z.boolean().optional(),
});

export type CreateCompanyOfficeLocationRequestDto = z.infer<typeof CreateCompanyOfficeLocationDto>;
export type UpdateCompanyOfficeLocationRequestDto = z.infer<typeof UpdateCompanyOfficeLocationDto>;