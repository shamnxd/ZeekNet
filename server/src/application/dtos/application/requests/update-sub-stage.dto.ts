import { z } from 'zod';
import { ATS_SUB_STAGE_VALUES } from 'src/domain/utils/ats-sub-stage-values';

export const UpdateSubStageDtoSchema = z.object({
  subStage: z.enum(ATS_SUB_STAGE_VALUES as [string, ...string[]], {
    errorMap: () => ({ message: 'Invalid sub-stage' }),
  }),
});

export type UpdateSubStageDto = z.infer<typeof UpdateSubStageDtoSchema> & {
  applicationId: string;
  userId: string;
  userName: string;
};


