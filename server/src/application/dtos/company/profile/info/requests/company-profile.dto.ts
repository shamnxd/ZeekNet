import { z } from 'zod';

export const SimpleUpdateCompanyProfileDto = z.object({
  userId: z.string().optional(),
  company_name: z.string().min(1).optional(),
  logo: z.string().optional(),
  banner: z.string().optional(),
  website_link: z.string().url().optional(),
  employee_count: z.number().min(1).optional(),
  industry: z.string().min(1).optional(),
  organisation: z.string().min(1).optional(),
  about_us: z.string().min(1).optional(),
  business_license: z.string().optional(),
  tax_id: z.string().optional(),
});

export type SimpleUpdateCompanyProfileRequestDto = z.infer<typeof SimpleUpdateCompanyProfileDto>;
