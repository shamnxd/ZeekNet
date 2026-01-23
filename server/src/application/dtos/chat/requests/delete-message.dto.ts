import { z } from 'zod';

export const DeleteMessageDtoSchema = z.object({
    userId: z.string().min(1, 'User ID is required'),
    messageId: z.string().min(1, 'Message ID is required'),
});

export type DeleteMessageDto = z.infer<typeof DeleteMessageDtoSchema>;
