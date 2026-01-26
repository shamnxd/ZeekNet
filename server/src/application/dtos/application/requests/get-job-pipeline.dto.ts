import { z } from 'zod';

export const GetJobPipelineDtoSchema = z.object({
  jobId: z.string(),
  userId: z.string(),
});

export type GetJobPipelineDto = z.infer<typeof GetJobPipelineDtoSchema>;

