import { z } from 'zod';

// This is the DTO that the Use Case receives (includes senderId from auth)
export const SendMessageDtoSchema = z.object({
    senderId: z.string().min(1, 'Sender ID is required'),
    receiverId: z.string().min(1, 'Receiver ID is required'),
    content: z.string().trim().min(1, 'Message content is required').max(2000, 'Message is too long'),
    conversationId: z.string().min(1, 'Conversation ID is required'),
    replyToMessageId: z.string().optional(),
});

export type SendMessageDto = z.infer<typeof SendMessageDtoSchema>;
