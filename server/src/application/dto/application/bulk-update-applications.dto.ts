import { z } from 'zod';

export const BulkUpdateApplicationsDto = z.object({
  application_ids: z.array(z.string().min(1, 'Application ID is required')).min(1, 'At least one application ID is required'),
  stage: z.enum(['shortlisted', 'rejected'], {
    errorMap: () => ({ message: 'Stage must be either shortlisted or rejected' }),
  }),
});
