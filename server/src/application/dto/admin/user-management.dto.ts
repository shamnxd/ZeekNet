import { z } from 'zod';
import { UserRole } from '../../../domain/enums/user-role.enum';

export const GetAllUsersDto = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).optional().default(10),
  search: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
  isBlocked: z.preprocess(
    (val) => {
      if (val === 'true') return true;
      if (val === 'false') return false;
      if (typeof val === 'boolean') return val;
      return undefined;
    },
    z.boolean().optional()
  ),
});

export const BlockUserDto = z.object({
  userId: z.string().min(1),
  isBlocked: z.boolean(),
});

export const CompanyVerificationDto = z.object({
  companyId: z.string().min(1),
  isVerified: z.enum(['pending', 'rejected', 'verified']),
  rejection_reason: z.string().optional(),
});

export type GetAllUsersRequestDto = z.infer<typeof GetAllUsersDto>;
export type GetAllCompaniesRequestDto = GetAllUsersRequestDto;