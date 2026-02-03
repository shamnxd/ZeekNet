import { z } from 'zod';

export const GetConversationsDtoSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export type GetConversationsDto = z.infer<typeof GetConversationsDtoSchema>;
