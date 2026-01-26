import { z } from 'zod';

export const AssignTechnicalTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  deadline: z.string().transform((str) => new Date(str)).or(z.date()),
  documentUrl: z.string().optional(),
  documentFilename: z.string().optional(),
});

export type AssignTechnicalTaskRequestDto = z.infer<typeof AssignTechnicalTaskSchema> & {
  applicationId: string;
  performedBy: string;
};
