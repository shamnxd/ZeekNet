import { z } from 'zod';

export const GetAllCompaniesDto = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  isVerified: z.enum(['pending', 'rejected', 'verified']).optional(),
  isBlocked: z.boolean().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type GetAllCompaniesRequestDto = z.infer<typeof GetAllCompaniesDto>;

export const VerifyCompanyDto = z.object({
  companyId: z.string().min(1, 'Company ID is required'),
  isVerified: z.enum(['pending', 'rejected', 'verified']),
});

export type VerifyCompanyRequestDto = z.infer<typeof VerifyCompanyDto>;