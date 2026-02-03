import { z } from 'zod';

export const DeleteImageDtoSchema = z.object({
  imageUrl: z.string().url('Must be a valid URL').min(1, 'Image URL is required'),
});

export type DeleteImageDto = z.infer<typeof DeleteImageDtoSchema>;

