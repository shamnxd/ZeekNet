import { z } from 'zod';

export const GetJobPostingsQueryDtoSchema = z.object({
  userId: z.string().optional(),
  is_active: z.coerce.boolean().optional(),
  category_ids: z
    .string()
    .transform((val) => val.split(','))
    .optional(),
  employment_types: z
    .string()
    .transform((val) => val.split(',') as ('full-time' | 'part-time' | 'contract' | 'internship' | 'remote')[])
    .optional(),
  salary_min: z.coerce.number().min(0).optional(),
  salary_max: z.coerce.number().min(0).optional(),
  company_id: z.string().optional(),
  location: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type GetJobPostingsQueryDto = z.infer<typeof GetJobPostingsQueryDtoSchema>;


export const JobPostingQueryDto = GetJobPostingsQueryDtoSchema;

export type JobPostingQueryRequestDto = GetJobPostingsQueryDto;

