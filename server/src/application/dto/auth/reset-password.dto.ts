import { z } from 'zod';

export const ResetPasswordDto = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(6),
});