import { z } from 'zod';

export const UpdateTechnicalTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  deadline: z.string().transform((str) => new Date(str)).or(z.date()).optional(),
  documentUrl: z.string().optional(),
  documentFilename: z.string().optional(),
  submissionUrl: z.string().optional(),
  submissionFilename: z.string().optional(),
  status: z.enum(['assigned', 'submitted', 'under_review', 'completed', 'cancelled']).optional(),
  rating: z.number().min(1).max(5).optional(),
  feedback: z.string().optional(),
});

export type UpdateTechnicalTaskRequestDto = z.infer<typeof UpdateTechnicalTaskSchema> & {
  taskId: string;
  performedBy: string;
};
