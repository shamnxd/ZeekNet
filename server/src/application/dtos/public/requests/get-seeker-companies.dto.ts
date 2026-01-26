import { z } from 'zod';

export const GetSeekerCompaniesDtoSchema = z.object({
  page: z.string().transform(val => parseInt(val, 10)).optional().default('1'),
  limit: z.string().transform(val => parseInt(val, 10)).optional().default('10'),
  search: z.string().optional(),
  industry: z.string().optional(),
});

export type GetSeekerCompaniesDto = z.infer<typeof GetSeekerCompaniesDtoSchema>;
