import { z } from 'zod';

export const AddEducationRequestDtoSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  school: z.string().min(1, 'School is required').max(200, 'School must not exceed 200 characters'),
  degree: z.string().max(100, 'Degree must not exceed 100 characters').optional(),
  fieldOfStudy: z.string().max(100, 'Field of study must not exceed 100 characters').optional(),
  startDate: z.string().date('Please enter a valid start date'),
  endDate: z.string().date('Please enter a valid end date').optional(),
  grade: z.string().max(50, 'Grade must not exceed 20 characters').optional(),
});

export type AddEducationRequestDto = z.infer<typeof AddEducationRequestDtoSchema>;


export const AddEducationDto = AddEducationRequestDtoSchema;

