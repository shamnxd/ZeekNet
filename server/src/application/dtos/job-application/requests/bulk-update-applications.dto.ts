import { z } from 'zod';
import { ATSStage } from '../../../../domain/enums/ats-stage.enum';

export const BulkUpdateApplicationsDto = z.object({
  application_ids: z.array(z.string().min(1, 'Application ID is required')).min(1, 'At least one application ID is required'),
  stage: z.nativeEnum(ATSStage, {
    errorMap: () => ({ message: 'Invalid stage' }),
  }),
});

