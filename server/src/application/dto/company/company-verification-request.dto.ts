import { z } from 'zod';

export const CompanyVerificationRequestDto = z.object({
  userId: z.string().optional(),
  taxId: z.string().min(1, 'Tax ID is required').optional(),
  businessLicenseUrl: z.string().url('Invalid business license URL').optional(),
});

export type CompanyVerificationRequestDtoType = z.infer<typeof CompanyVerificationRequestDto>;





