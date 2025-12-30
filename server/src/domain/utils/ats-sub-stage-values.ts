import {
  InReviewSubStage,
  ShortlistedSubStage,
  InterviewSubStage,
  TechnicalTaskSubStage,
  CompensationSubStage,
  OfferSubStage,
} from '../enums/ats-stage.enum';

/**
 * All possible ATS sub-stage values as an array for Zod validation
 */
export const ATS_SUB_STAGE_VALUES = [
  ...Object.values(InReviewSubStage),
  ...Object.values(ShortlistedSubStage),
  ...Object.values(InterviewSubStage),
  ...Object.values(TechnicalTaskSubStage),
  ...Object.values(CompensationSubStage),
  ...Object.values(OfferSubStage),
] as const;



