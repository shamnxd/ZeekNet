import { z } from 'zod';

export const GetAllJobCategoriesQueryDtoSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).optional().default(10),
  search: z.string().optional(),
});

export type GetAllJobCategoriesQueryDto = z.infer<typeof GetAllJobCategoriesQueryDtoSchema>;

// Export for router validation
export const GetAllJobCategoriesDto = GetAllJobCategoriesQueryDtoSchema;

export type GetAllJobCategoriesRequestDto = GetAllJobCategoriesQueryDto;

