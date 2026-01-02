import { z } from 'zod';

export const GetAllSkillsQueryDtoSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  search: z.string().optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type GetAllSkillsQueryDto = z.infer<typeof GetAllSkillsQueryDtoSchema>;


export const GetAllSkillsDto = GetAllSkillsQueryDtoSchema;

export type GetAllSkillsRequestDto = GetAllSkillsQueryDto;

