import { z } from 'zod';

export const CreateJobCategoryDto = z.object({
  name: z.string().min(1, 'Category name is required').max(100, 'Category name must not exceed 100 characters'),
});

export const UpdateJobCategoryDto = z.object({
  name: z.string().min(1, 'Category name is required').max(100, 'Category name must not exceed 100 characters'),
});

export const GetAllJobCategoriesDto = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).optional().default(10),
  search: z.string().optional(),
});

export type GetAllJobCategoriesRequestDto = z.infer<typeof GetAllJobCategoriesDto>;