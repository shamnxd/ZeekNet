import { z } from 'zod';

export const UploadResumeRequestDtoSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  url: z.string().min(1, 'Resume URL is required'),
  fileName: z.string().min(1, 'File name is required'),
});

export type UploadResumeRequestDto = z.infer<typeof UploadResumeRequestDtoSchema>;

// Export for validation
export const UploadResumeDto = UploadResumeRequestDtoSchema;

