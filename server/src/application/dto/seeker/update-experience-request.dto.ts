import { z } from 'zod';

const EmploymentTypeSchema = z.enum(['full-time', 'part-time', 'contract', 'internship', 'remote', 'freelance']);

export const UpdateExperienceRequestDtoSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  experienceId: z.string().min(1, 'Experience ID is required'),
  title: z.string().min(1, 'Title is required').max(100, 'Title must not exceed 100 characters').optional(),
  company: z.string().min(1, 'Company is required').max(100, 'Company must not exceed 100 characters').optional(),
  startDate: z.string().date('Please enter a valid start date').optional(),
  endDate: z.string().date('Please enter a valid end date').optional(),
  employmentType: EmploymentTypeSchema.optional(),
  location: z.string().max(100, 'Location must not exceed 100 characters').optional(),
  description: z.string().max(2000, 'Description must not exceed 2000 characters').optional(),
  technologies: z.array(z.string()).optional(),
  isCurrent: z.boolean().optional(),
});

export type UpdateExperienceRequestDto = z.infer<typeof UpdateExperienceRequestDtoSchema>;


export const UpdateExperienceDto = UpdateExperienceRequestDtoSchema;

