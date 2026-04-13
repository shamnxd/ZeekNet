import { z } from 'zod';
import { VALIDATION } from 'src/shared/constants/messages';

export const LoginDto = z.object({
  email: z.string().email(VALIDATION.INVALID_EMAIL),
  password: z.string().min(1, VALIDATION.REQUIRED('Password')),
});



export type LoginRequestDto = z.infer<typeof LoginDto>;
