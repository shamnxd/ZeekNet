import { z } from 'zod';
import { CompanyVerificationStatus } from '../../../domain/enums/verification-status.enum';

export const GetCompaniesQueryDtoSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).optional().default(10),
  search: z.string().optional(),
  isVerified: z.nativeEnum(CompanyVerificationStatus).optional(),
  isBlocked: z.coerce.boolean().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type GetCompaniesQueryDto = z.infer<typeof GetCompaniesQueryDtoSchema>;

