import { z } from 'zod';
import { ApplicationStage } from '../../../domain/enums/application-stage.enum';

export const BulkUpdateApplicationsDto = z.object({
  application_ids: z.array(z.string().min(1, 'Application ID is required')).min(1, 'At least one application ID is required'),
  stage: z.enum([ApplicationStage.SHORTLISTED, ApplicationStage.REJECTED], {
    errorMap: () => ({ message: 'Stage must be either shortlisted or rejected' }),
  }),
});
