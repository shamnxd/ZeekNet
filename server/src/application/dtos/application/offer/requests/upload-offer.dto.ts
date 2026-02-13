import { z } from 'zod';
import { UploadedFile } from 'src/domain/types/common.types';

export const UploadOfferSchema = z.object({
  offerAmount: z.string().optional(),
  documentUrl: z.string().optional(),
});

export type UploadOfferRequestDto = z.infer<typeof UploadOfferSchema> & {
  applicationId: string;
  performedBy: string;
  file?: UploadedFile;
};
