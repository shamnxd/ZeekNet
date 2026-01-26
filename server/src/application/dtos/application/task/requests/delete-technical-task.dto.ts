import { z } from 'zod';

export const DeleteTechnicalTaskRequestDtoSchema = z.object({
  taskId: z.string().uuid('Task ID must be a valid UUID'),
  performedBy: z.string().uuid('Performed by must be a valid UUID'),
  performedByName: z.string().min(1, 'Performed by name is required'),
});

export type DeleteTechnicalTaskRequestDto = z.infer<typeof DeleteTechnicalTaskRequestDtoSchema>;
