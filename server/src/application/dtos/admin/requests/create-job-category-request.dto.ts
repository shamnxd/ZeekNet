import { z } from 'zod';

export const CreateJobCategoryRequestDtoSchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100, 'Category name must not exceed 100 characters'),
});

export type CreateJobCategoryRequestDto = z.infer<typeof CreateJobCategoryRequestDtoSchema>;


export const CreateJobCategoryDto = CreateJobCategoryRequestDtoSchema;

