import { z } from 'zod';
export const VerifyOtpDto = z.object({
  email: z.string().email('Invalid email address'),
  code: z.string().length(6, 'OTP code must be 6 characters'),
});
export type VerifyOtpRequestDto = z.infer<typeof VerifyOtpDto>;