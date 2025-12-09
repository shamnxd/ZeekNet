import { z } from 'zod';

export const CreateCompanyProfileFromDtoSchema = z.object({
  userId: z.string().optional(),
  company_name: z.string().min(1, 'Company name is required'),
  logo: z.string().url('Invalid logo URL').optional(),
  website: z.string().url('Invalid website URL').optional(),
  employees: z.string().min(1, 'Employee count is required'),
  industry: z.string().min(1, 'Industry is required'),
  organisation: z.string().min(1, 'Organisation is required'),
  description: z.string().min(1, 'Description is required'),
  tax_id: z.string().optional(),
  business_license: z.string().url('Invalid business license URL').optional(),
  email: z.string().email('Invalid email').optional(),
  location: z.string().optional(),
});

export type CreateCompanyProfileFromDtoRequestDto = z.infer<typeof CreateCompanyProfileFromDtoSchema>;
