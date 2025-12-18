import { z } from 'zod';

export const UpdateJobCategoryRequestDtoSchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100, 'Category name must not exceed 100 characters'),
});

export type UpdateJobCategoryRequestDto = z.infer<typeof UpdateJobCategoryRequestDtoSchema>;


export const UpdateJobCategoryDto = UpdateJobCategoryRequestDtoSchema;

