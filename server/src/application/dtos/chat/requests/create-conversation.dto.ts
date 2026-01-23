import { z } from 'zod';

export const CreateConversationDtoSchema = z.object({
  creatorId: z.string().min(1, 'Creator ID is required'),
  participantId: z.string().min(1, 'Participant ID is required'),
});

export type CreateConversationDto = z.infer<typeof CreateConversationDtoSchema>;
