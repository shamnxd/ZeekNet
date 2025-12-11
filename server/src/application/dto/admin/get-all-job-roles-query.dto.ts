import { z } from 'zod';

export const GetAllJobRolesQueryDtoSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  search: z.string().optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type GetAllJobRolesQueryDto = z.infer<typeof GetAllJobRolesQueryDtoSchema>;

// Export for router validation
export const GetAllJobRolesDto = GetAllJobRolesQueryDtoSchema;

export type GetAllJobRolesRequestDto = GetAllJobRolesQueryDto;

