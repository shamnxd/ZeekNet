import { z } from 'zod';
import { UserRole } from 'src/domain/enums/user-role.enum';

export const GetAllUsersQueryDtoSchema = z.object({
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
    z.boolean().optional(),
  ),
});

export type GetAllUsersQueryDto = z.infer<typeof GetAllUsersQueryDtoSchema>;


export const GetAllUsersDto = GetAllUsersQueryDtoSchema;


