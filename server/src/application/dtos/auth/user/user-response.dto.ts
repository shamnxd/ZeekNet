import { z } from 'zod';
import { SeekerProfileResponseDto } from 'src/application/dtos/seeker/profile/info/responses/seeker-profile-response.dto';

export const UserResponseDto = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.string(),
  isVerified: z.boolean(),
  isBlocked: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  avatar: z.string().optional(),
  seekerProfile: z.custom<SeekerProfileResponseDto>().optional(),
});

export type UserResponseDto = z.infer<typeof UserResponseDto>;