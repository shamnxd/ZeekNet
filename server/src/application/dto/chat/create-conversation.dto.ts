import { z } from 'zod';

export const CreateConversationRequestDtoSchema = z.object({
  participantId: z.string().min(1, 'participantId is required'),
});

export type CreateConversationRequestDto = z.infer<typeof CreateConversationRequestDtoSchema>;

export const CreateConversationDto = CreateConversationRequestDtoSchema;












