import { z } from 'zod';

const EmploymentTypeSchema = z.enum(['full-time', 'part-time', 'contract', 'internship', 'remote']);

const SalarySchema = z
  .object({
    min: z.number().min(0, 'Minimum salary must be positive'),
    max: z.number().min(0, 'Maximum salary must be positive'),
  })
  .refine((data) => data.max >= data.min, {
    message: 'Maximum salary must be greater than or equal to minimum salary',
    path: ['max'],
  });

export const CreateJobPostingRequestDto = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must not exceed 100 characters'),
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
});

export const UpdateJobPostingDto = z.object({
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
  is_active: z.boolean().optional(),
});

export const JobPostingQueryDto = z.object({
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

export type CreateJobPostingRequestDto = z.infer<typeof CreateJobPostingRequestDto>;
export type UpdateJobPostingRequestDto = z.infer<typeof UpdateJobPostingDto>;
export type JobPostingQueryRequestDto = z.infer<typeof JobPostingQueryDto>;