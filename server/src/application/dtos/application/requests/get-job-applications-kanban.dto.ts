import { z } from 'zod';

export const GetJobApplicationsKanbanDtoSchema = z.object({
  jobId: z.string(),
  userId: z.string(),
});

export type GetJobApplicationsKanbanDto = z.infer<typeof GetJobApplicationsKanbanDtoSchema>;

