import { z } from 'zod';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { commonValidations, fieldValidations } from 'src/shared/validation/common';

export const RegisterDto = z.object({
  name: fieldValidations.personName,
  email: commonValidations.email,
  password: commonValidations.password,
  role: z.nativeEnum(UserRole).optional().default(UserRole.SEEKER),
});



export type RegisterRequestDto = z.infer<typeof RegisterDto>;
