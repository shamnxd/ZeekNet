import { z } from 'zod';
import {
  ATSStage,
  InReviewSubStage,
  ShortlistedSubStage,
  InterviewSubStage,
  TechnicalTaskSubStage,
  CompensationSubStage,
  OfferSubStage,
} from 'src/domain/enums/ats-stage.enum';

export const AddCommentRequestDtoSchema = z.object({
  applicationId: z.string().min(1, 'Application ID is required'),
  comment: z.string().min(1, 'Comment is required'),
  stage: z.nativeEnum(ATSStage),
  subStage: z.union([
    z.nativeEnum(InReviewSubStage),
    z.nativeEnum(ShortlistedSubStage),
    z.nativeEnum(InterviewSubStage),
    z.nativeEnum(TechnicalTaskSubStage),
    z.nativeEnum(CompensationSubStage),
    z.nativeEnum(OfferSubStage),
  ]).optional(),
});

export type AddCommentRequestDto = z.infer<typeof AddCommentRequestDtoSchema>;
