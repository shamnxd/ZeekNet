import { z } from 'zod';

export const BlockUserRequestDtoSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  isBlocked: z.boolean(),
});

export type BlockUserRequestDto = z.infer<typeof BlockUserRequestDtoSchema>;

export const BlockUserDto = BlockUserRequestDtoSchema;
