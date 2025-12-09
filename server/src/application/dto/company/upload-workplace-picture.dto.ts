import { z } from 'zod';

export const UploadWorkplacePictureDto = z.object({
  buffer: z.instanceof(Buffer, { message: 'File buffer is required' }),
  originalname: z.string().min(1, 'File name is required'),
  mimetype: z.string().min(1, 'MIME type is required'),
});

export type UploadWorkplacePictureRequestDto = z.infer<typeof UploadWorkplacePictureDto>;
