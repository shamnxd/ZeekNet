import { z } from 'zod';

export const GetMessagesDtoSchema = z.object({
    userId: z.string().min(1, 'User ID is required'),
    conversationId: z.string().min(1, 'Conversation ID is required'),
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(200).default(50),
});

export type GetMessagesDto = z.infer<typeof GetMessagesDtoSchema>;
