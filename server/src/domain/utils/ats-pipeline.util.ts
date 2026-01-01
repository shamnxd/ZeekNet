import {
  ATSStage,
  ATSSubStage,
  InReviewSubStage,
  ShortlistedSubStage,
  InterviewSubStage,
  TechnicalTaskSubStage,
  CompensationSubStage,
  OfferSubStage,
} from 'src/domain/enums/ats-stage.enum';


export const STAGE_TO_SUB_STAGES: Record<ATSStage, readonly ATSSubStage[]> = {
  [ATSStage.IN_REVIEW]: Object.values(InReviewSubStage),
  [ATSStage.SHORTLISTED]: Object.values(ShortlistedSubStage),
  [ATSStage.INTERVIEW]: Object.values(InterviewSubStage),
  [ATSStage.TECHNICAL_TASK]: Object.values(TechnicalTaskSubStage),
  [ATSStage.COMPENSATION]: Object.values(CompensationSubStage),
  [ATSStage.OFFER]: Object.values(OfferSubStage),
  [ATSStage.HIRED]: [],
};


export function getDefaultSubStage(stage: ATSStage): ATSSubStage {
  switch (stage) {
  case ATSStage.IN_REVIEW:
    return InReviewSubStage.PROFILE_REVIEW;
  case ATSStage.SHORTLISTED:
    return ShortlistedSubStage.READY_FOR_INTERVIEW;
  case ATSStage.INTERVIEW:
    return InterviewSubStage.NOT_SCHEDULED;
  case ATSStage.TECHNICAL_TASK:
    return TechnicalTaskSubStage.NOT_ASSIGNED;
  case ATSStage.COMPENSATION:
    return CompensationSubStage.NOT_INITIATED;
  case ATSStage.OFFER:
    return OfferSubStage.NOT_SENT;
  case ATSStage.HIRED:
    return InReviewSubStage.PROFILE_REVIEW; 
  default:
    return InReviewSubStage.PROFILE_REVIEW;
  }
}


export function isValidSubStageForStage(stage: ATSStage, subStage: ATSSubStage): boolean {
  const validSubStages = STAGE_TO_SUB_STAGES[stage];
  return validSubStages.includes(subStage);
}


export function getValidSubStagesForStage(stage: ATSStage): readonly ATSSubStage[] {
  return STAGE_TO_SUB_STAGES[stage];
}

