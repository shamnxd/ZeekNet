import { z } from 'zod';

export const GetMessagesRequestDtoSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  conversationId: z.string().min(1, 'Conversation ID is required'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(50),
});

export type GetMessagesRequestDto = z.infer<typeof GetMessagesRequestDtoSchema>;

















