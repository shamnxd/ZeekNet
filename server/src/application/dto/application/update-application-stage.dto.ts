import { z } from 'zod';
import { ApplicationStage } from '../../../domain/enums/application-stage.enum';

const ApplicationStageSchema = z.nativeEnum(ApplicationStage);

export const UpdateApplicationStageDtoSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  applicationId: z.string().min(1, 'Application ID is required'),
  stage: ApplicationStageSchema,
  rejectionReason: z.string().optional(),
});

export type UpdateApplicationStageDto = z.infer<typeof UpdateApplicationStageDtoSchema>;

// Export for validation
export const UpdateApplicationStageDto = UpdateApplicationStageDtoSchema;

// Export schema for validation
export const UpdateApplicationStageRequestDtoSchema = z.object({
  stage: ApplicationStageSchema,
  rejectionReason: z.string().optional(),
});