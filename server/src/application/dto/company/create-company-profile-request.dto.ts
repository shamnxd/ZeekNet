import { z } from 'zod';

export const CreateCompanyProfileRequestDto = z.object({
  userId: z.string().optional(),
  companyName: z.string().min(1, 'Company name is required'),
  logo: z.string().url('Invalid logo URL'),
  banner: z.string().url('Invalid banner URL'),
  websiteLink: z.string().url('Invalid website URL'),
  employeeCount: z.number().int().positive('Employee count must be positive'),
  industry: z.string().min(1, 'Industry is required'),
  organisation: z.string().min(1, 'Organisation is required'),
  aboutUs: z.string().min(1, 'About us is required'),
  foundedDate: z.coerce.date().optional(),
  phone: z.string().optional(),
  taxId: z.string().optional(),
  businessLicenseUrl: z.string().url('Invalid business license URL').optional(),
  email: z.string().email('Invalid email').optional(),
  location: z.string().optional(),
});

export type CreateCompanyProfileRequestDtoType = z.infer<typeof CreateCompanyProfileRequestDto>;

