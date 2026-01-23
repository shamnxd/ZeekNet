import { z } from 'zod';

export const GetConversationsRequestDtoSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type GetConversationsRequestDto = z.infer<typeof GetConversationsRequestDtoSchema>;

















