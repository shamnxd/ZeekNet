import { z } from 'zod';

export const UpdateUserRefreshTokenDto = z.object({
  userId: z.string().min(1, 'User ID is required'),
  hashedRefreshToken: z.string().min(1, 'Refresh token is required'),
});

