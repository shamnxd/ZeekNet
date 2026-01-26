import { z } from 'zod';

export const GoogleLoginDto = z.object({
  idToken: z.string().min(10, 'Invalid Google token'),
});

export type GoogleLoginRequestDto = z.infer<typeof GoogleLoginDto>;
