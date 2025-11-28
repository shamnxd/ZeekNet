import { z } from 'zod';

export const RefreshTokenDto = z.object({
  refreshToken: z.string(),
});