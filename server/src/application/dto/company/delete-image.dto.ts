import { z } from 'zod';

export const DeleteImageDto = z.object({
  imageUrl: z.string().url('Must be a valid URL'),
});