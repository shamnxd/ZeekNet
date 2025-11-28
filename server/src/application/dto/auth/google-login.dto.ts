import { z } from 'zod';

export const GoogleLoginDto = z.object({
  idToken: z.string().min(10),
});