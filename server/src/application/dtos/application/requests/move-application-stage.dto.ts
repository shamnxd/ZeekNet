import { z } from 'zod';
import { ATSStage } from 'src/domain/enums/ats-stage.enum';
import { ATS_SUB_STAGE_VALUES } from 'src/domain/utils/ats-sub-stage-values';

export const MoveApplicationStageDtoSchema = z.object({
  nextStage: z.nativeEnum(ATSStage, {
    errorMap: () => ({ message: 'Invalid stage' }),
  }),
  subStage: z.enum(ATS_SUB_STAGE_VALUES as [string, ...string[]]).optional(),
  comment: z.string().optional(),
});

export type MoveApplicationStageDto = z.infer<typeof MoveApplicationStageDtoSchema> & {
  applicationId: string;
  userId: string;
  userName: string;
};


