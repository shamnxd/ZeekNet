import { z } from 'zod';

export const UploadOfferSchema = z.object({
  offerAmount: z.string().optional(),
  documentUrl: z.string().optional(),
  documentFilename: z.string().optional(),
});

export type UploadOfferRequestDto = z.infer<typeof UploadOfferSchema> & {
  applicationId: string;
  performedBy: string;
};
