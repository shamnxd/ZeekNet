import { z } from 'zod';

export const SendMessageRequestDtoSchema = z.object({
  receiverId: z.string().min(1, 'Receiver ID is required'),
  content: z.string().trim().min(1, 'Message content is required').max(2000, 'Message is too long'),
  conversationId: z.string().min(1, 'Conversation ID is required'),
  replyToMessageId: z.string().optional(),
});

export type SendMessageRequestDto = z.infer<typeof SendMessageRequestDtoSchema>;

export const SendMessageDto = SendMessageRequestDtoSchema;
