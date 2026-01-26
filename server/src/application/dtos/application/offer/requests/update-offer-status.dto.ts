import { z } from 'zod';

export const UpdateOfferStatusDtoSchema = z.object({
  status: z.enum(['draft', 'sent', 'signed', 'declined']),
  withdrawalReason: z.string().optional(),
});

export type UpdateOfferStatusDto = z.infer<typeof UpdateOfferStatusDtoSchema>;
