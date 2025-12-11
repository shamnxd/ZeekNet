import { z } from 'zod';

export const UploadBusinessLicenseDtoSchema = z.object({
  buffer: z.instanceof(Buffer, { message: 'File buffer is required' }),
  originalname: z.string().min(1, 'Original file name is required'),
  mimetype: z.string().min(1, 'MIME type is required'),
});

export type UploadBusinessLicenseDto = z.infer<typeof UploadBusinessLicenseDtoSchema>;
