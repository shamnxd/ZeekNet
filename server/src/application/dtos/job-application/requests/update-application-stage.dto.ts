import { z } from 'zod';
import { ATSStage } from '../../../../domain/enums/ats-stage.enum';

const ATSStageSchema = z.nativeEnum(ATSStage);

export const UpdateApplicationStageDtoSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  applicationId: z.string().min(1, 'Application ID is required'),
  stage: ATSStageSchema,
  subStage: z.string().optional(),
  rejectionReason: z.string().optional(),
});

export type UpdateApplicationStageDto = z.infer<typeof UpdateApplicationStageDtoSchema>;


export const UpdateApplicationStageDto = UpdateApplicationStageDtoSchema;


export const UpdateApplicationStageRequestDtoSchema = z.object({
  stage: ATSStageSchema,
  subStage: z.string().optional(),
  rejectionReason: z.string().optional(),
});

