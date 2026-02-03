import { z } from 'zod';

export const MarkMessagesAsReadDtoSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  conversationId: z.string().min(1, 'Conversation ID is required'),
});

export type MarkMessagesAsReadDto = z.infer<typeof MarkMessagesAsReadDtoSchema>;
