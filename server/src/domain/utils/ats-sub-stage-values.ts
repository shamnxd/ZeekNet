import {
  InReviewSubStage,
  ShortlistedSubStage,
  InterviewSubStage,
  TechnicalTaskSubStage,
  CompensationSubStage,
  OfferSubStage,
} from 'src/domain/enums/ats-stage.enum';


export const ATS_SUB_STAGE_VALUES = [
  ...Object.values(InReviewSubStage),
  ...Object.values(ShortlistedSubStage),
  ...Object.values(InterviewSubStage),
  ...Object.values(TechnicalTaskSubStage),
  ...Object.values(CompensationSubStage),
  ...Object.values(OfferSubStage),
] as const;



