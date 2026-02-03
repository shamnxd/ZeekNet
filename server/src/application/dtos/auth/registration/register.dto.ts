import { z } from 'zod';
import { UserRole } from 'src/domain/enums/user-role.enum';

export const RegisterDto = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.nativeEnum(UserRole).optional().default(UserRole.SEEKER),
});

export type RegisterRequestDto = z.infer<typeof RegisterDto>;
