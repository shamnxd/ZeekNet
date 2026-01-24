import { z } from 'zod';

import { EmploymentType } from 'src/domain/enums/employment-type.enum';

const EmploymentTypeSchema = z.nativeEnum(EmploymentType);

const SalarySchema = z
  .object({
    min: z.number().min(0, 'Minimum salary must be positive'),
    max: z.number().min(0, 'Maximum salary must be positive'),
  })
  .refine((data) => data.max >= data.min, {
    message: 'Maximum salary must be greater than or equal to minimum salary',
    path: ['max'],
  });

export const CreateJobPostingRequestDtoSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(100, 'Title must not exceed 100 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters').max(2000, 'Description must not exceed 2000 characters'),
  responsibilities: z.array(z.string().min(5, 'Each responsibility must be at least 5 characters')).min(1, 'At least one responsibility is required'),
  qualifications: z.array(z.string().min(5, 'Each qualification must be at least 5 characters')).min(1, 'At least one qualification is required'),
  nice_to_haves: z.array(z.string()).default([]),
  benefits: z.array(z.string()).default([]),
  salary: SalarySchema,
  employment_types: z.array(EmploymentTypeSchema).min(1, 'At least one employment type is required'),
  location: z.string().min(2, 'Location must be at least 2 characters').max(100, 'Location must not exceed 100 characters'),
  skills_required: z.array(z.string()).default([]),
  category_ids: z.array(z.string().min(1, 'Category ID is required')).min(1, 'At least one category is required'),
  enabled_stages: z.array(z.string()).optional(),
  is_featured: z.boolean().optional().default(false),
  total_vacancies: z.number().int().min(1, 'Total vacancies must be at least 1').optional().default(1),
});

export type CreateJobPostingRequestDto = z.infer<typeof CreateJobPostingRequestDtoSchema> & {
  userId?: string;
};


