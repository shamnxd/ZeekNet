import { z } from 'zod';

const EmploymentTypeSchema = z.enum(['full-time', 'part-time', 'contract', 'internship', 'remote', 'freelance']);

export const AddExperienceRequestDtoSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  title: z.string().min(1, 'Title is required').max(100, 'Title must not exceed 100 characters'),
  company: z.string().min(1, 'Company is required').max(100, 'Company must not exceed 100 characters'),
  startDate: z.string().date('Please enter a valid start date'),
  endDate: z.string().date('Please enter a valid end date').optional(),
  employmentType: EmploymentTypeSchema,
  location: z.string().max(100, 'Location must not exceed 100 characters').optional(),
  description: z.string().max(2000, 'Description must not exceed 2000 characters').optional(),
  technologies: z.array(z.string()).default([]),
  isCurrent: z.boolean().default(false),
});

export type AddExperienceRequestDto = z.infer<typeof AddExperienceRequestDtoSchema>;


export const AddExperienceDto = AddExperienceRequestDtoSchema;

