import { z } from 'zod';

export const VerifyCompanyRequestDtoSchema = z.object({
  companyId: z.string().min(1),
  isVerified: z.enum(['pending', 'rejected', 'verified']),
  rejection_reason: z.string().optional(),
});

export type VerifyCompanyRequestDto = z.infer<typeof VerifyCompanyRequestDtoSchema>;

