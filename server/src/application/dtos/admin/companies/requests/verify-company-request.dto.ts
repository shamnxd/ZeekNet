import { z } from 'zod';

export const VerifyCompanyRequestDtoSchema = z.object({
  companyId: z.string().min(1, 'Company ID is required'),
  isVerified: z.enum(['pending', 'rejected', 'verified']),
  rejection_reason: z.string().optional(),
});

export type VerifyCompanyRequestDto = z.infer<typeof VerifyCompanyRequestDtoSchema>;

export const VerifyCompanyDto = VerifyCompanyRequestDtoSchema;

