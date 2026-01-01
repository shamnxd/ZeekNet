import { z } from 'zod';

export const UploadBannerDtoSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  fileBuffer: z.instanceof(Buffer, { message: 'File buffer is required' }),
  fileName: z.string().min(1, 'File name is required'),
  mimeType: z.string().min(1, 'MIME type is required'),
});

export type UploadBannerDto = z.infer<typeof UploadBannerDtoSchema>;

