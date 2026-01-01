import { z } from 'zod';

export const UpdateUserVerificationStatusDto = z.object({
  email: z.string().email('Invalid email address'),
  isVerified: z.boolean(),
});

