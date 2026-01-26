import { z } from 'zod';
import { ReopenJobDto } from './reopen-job.dto';

export const ReopenJobRequestDto = ReopenJobDto.extend({
  jobId: z.string().min(1, 'Job ID is required'),
  userId: z.string().min(1, 'User ID is required'),
});

export type ReopenJobRequestDto = z.infer<typeof ReopenJobRequestDto>;
