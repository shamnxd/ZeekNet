import { z } from 'zod';

export const UpdateJobCategoryDto = z.object({
  id: z.string().min(1, 'Job category ID is required'),
  name: z.string().min(1, 'Job category name is required'),
});

export type UpdateJobCategoryRequestDto = z.infer<typeof UpdateJobCategoryDto>;
