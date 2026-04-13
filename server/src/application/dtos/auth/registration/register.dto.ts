import { z } from 'zod';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { VALIDATION } from 'src/shared/constants/messages';

export const RegisterDto = z.object({
  name: z.string().min(1, VALIDATION.REQUIRED('Name')).min(2, VALIDATION.MIN_LENGTH('Name', 2)).max(50, VALIDATION.MAX_LENGTH('Name', 50)),
  email: z.string().email(VALIDATION.INVALID_EMAIL),
  password: z.string().min(6, VALIDATION.PASSWORD_STRENGTH),
  role: z.nativeEnum(UserRole).optional().default(UserRole.SEEKER),
});


export type RegisterRequestDto = z.infer<typeof RegisterDto>;
