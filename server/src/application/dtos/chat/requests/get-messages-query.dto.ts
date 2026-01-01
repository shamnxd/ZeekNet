import { z } from 'zod';

export const GetMessagesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(50),
});

export type GetMessagesQueryDto = z.infer<typeof GetMessagesQuerySchema>;

export const GetMessagesQueryDto = GetMessagesQuerySchema;















