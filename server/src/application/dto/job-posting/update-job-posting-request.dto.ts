import { z } from 'zod';

import { EmploymentType } from '../../../domain/enums/employment-type.enum';

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

export const UpdateJobPostingRequestDtoSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must not exceed 100 characters').optional(),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description must not exceed 2000 characters').optional(),
  responsibilities: z.array(z.string().min(10, 'Each responsibility must be at least 10 characters')).optional(),
  qualifications: z.array(z.string().min(10, 'Each qualification must be at least 10 characters')).optional(),
  nice_to_haves: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  salary: SalarySchema.optional(),
  employment_types: z.array(EmploymentTypeSchema).optional(),
  location: z.string().min(2, 'Location must be at least 2 characters').max(100, 'Location must not exceed 100 characters').optional(),
  skills_required: z.array(z.string()).optional(),
  category_ids: z.array(z.string().min(1, 'Category ID is required')).optional(),
  enabled_stages: z.array(z.string()).optional(),
  is_active: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  total_vacancies: z.number().int().min(1, 'Total vacancies must be at least 1').optional(),
});

export type UpdateJobPostingRequestDto = z.infer<typeof UpdateJobPostingRequestDtoSchema>;


export const UpdateJobPostingDto = UpdateJobPostingRequestDtoSchema;

