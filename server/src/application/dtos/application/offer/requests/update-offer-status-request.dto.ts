import { z } from 'zod';

export const UpdateOfferStatusRequestSchema = z.object({
  status: z.enum(['draft', 'sent', 'signed', 'declined']),
  withdrawalReason: z.string().optional(),
});

export type UpdateOfferStatusRequestDto = z.infer<typeof UpdateOfferStatusRequestSchema> & {
    offerId: string;
    performedBy: string;
    performedByName: string;
};
