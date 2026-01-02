// Server enum values (must match server/src/domain/enums/ats-stage.enum.ts)
export const ATSStage = {
  IN_REVIEW: 'IN_REVIEW',
  SHORTLISTED: 'SHORTLISTED',
  INTERVIEW: 'INTERVIEW',
  TECHNICAL_TASK: 'TECHNICAL_TASK',
  COMPENSATION: 'COMPENSATION',
  OFFER: 'OFFER',
  HIRED: 'HIRED'
} as const;

// Display names for UI
export const ATSStageDisplayNames: Record<string, string> = {
  [ATSStage.IN_REVIEW]: 'In Review',
  [ATSStage.SHORTLISTED]: 'Shortlisted',
  [ATSStage.INTERVIEW]: 'Interview',
  [ATSStage.TECHNICAL_TASK]: 'Technical Task',
  [ATSStage.COMPENSATION]: 'Compensation',
  [ATSStage.OFFER]: 'Offer',
  [ATSStage.HIRED]: 'Hired'
};

export type ATSStage = typeof ATSStage[keyof typeof ATSStage];

// Server enum values (must match server)
export const InReviewSubStage = {
  PROFILE_REVIEW: 'PROFILE_REVIEW',
  PENDING_DECISION: 'PENDING_DECISION'
} as const;

export const ShortlistedSubStage = {
  READY_FOR_INTERVIEW: 'READY_FOR_INTERVIEW',
  CONTACTED: 'CONTACTED',
  AWAITING_RESPONSE: 'AWAITING_RESPONSE'
} as const;

export const InterviewSubStage = {
  NOT_SCHEDULED: 'NOT_SCHEDULED',
  SCHEDULED: 'SCHEDULED',
  COMPLETED: 'COMPLETED',
  EVALUATION_PENDING: 'EVALUATION_PENDING'
} as const;

export const TechnicalTaskSubStage = {
  NOT_ASSIGNED: 'NOT_ASSIGNED',
  ASSIGNED: 'ASSIGNED',
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  COMPLETED: 'COMPLETED'
} as const;

export const CompensationSubStage = {
  NOT_INITIATED: 'NOT_INITIATED',
  INITIATED: 'INITIATED',
  NEGOTIATION_ONGOING: 'NEGOTIATION_ONGOING',
  APPROVED: 'APPROVED'
} as const;

export const OfferSubStage = {
  NOT_SENT: 'NOT_SENT',
  OFFER_SENT: 'OFFER_SENT',
  OFFER_ACCEPTED: 'OFFER_ACCEPTED',
  OFFER_DECLINED: 'OFFER_DECLINED'
} as const;

// Display names for UI
export const SubStageDisplayNames: Record<string, string> = {
  // IN_REVIEW
  [InReviewSubStage.PROFILE_REVIEW]: 'Profile Review',
  [InReviewSubStage.PENDING_DECISION]: 'Pending Decision',
  // SHORTLISTED
  [ShortlistedSubStage.READY_FOR_INTERVIEW]: 'Ready for Interview',
  [ShortlistedSubStage.CONTACTED]: 'Contacted',
  [ShortlistedSubStage.AWAITING_RESPONSE]: 'Awaiting Response',
  // INTERVIEW
  [InterviewSubStage.NOT_SCHEDULED]: 'Not Scheduled',
  [InterviewSubStage.SCHEDULED]: 'Scheduled',
  // COMPLETED is shared between INTERVIEW and TECHNICAL_TASK
  [InterviewSubStage.COMPLETED]: 'Completed',
  [InterviewSubStage.EVALUATION_PENDING]: 'Evaluation Pending',
  // TECHNICAL_TASK
  [TechnicalTaskSubStage.NOT_ASSIGNED]: 'Not Assigned',
  [TechnicalTaskSubStage.ASSIGNED]: 'Assigned',
  [TechnicalTaskSubStage.SUBMITTED]: 'Submitted',
  [TechnicalTaskSubStage.UNDER_REVIEW]: 'Under Review',
  // TechnicalTaskSubStage.COMPLETED uses the same value 'COMPLETED' as InterviewSubStage.COMPLETED, so the entry above covers both
  // COMPENSATION
  [CompensationSubStage.NOT_INITIATED]: 'Not Initiated',
  [CompensationSubStage.INITIATED]: 'Initiated',
  [CompensationSubStage.NEGOTIATION_ONGOING]: 'Negotiation Ongoing',
  [CompensationSubStage.APPROVED]: 'Approved',
  // OFFER
  [OfferSubStage.NOT_SENT]: 'Not Sent',
  [OfferSubStage.OFFER_SENT]: 'Offer Sent',
  [OfferSubStage.OFFER_ACCEPTED]: 'Offer Accepted',
  [OfferSubStage.OFFER_DECLINED]: 'Offer Declined'
};

export type ATSSubStage = 
  | typeof InterviewSubStage[keyof typeof InterviewSubStage]
  | typeof TechnicalTaskSubStage[keyof typeof TechnicalTaskSubStage]
  | typeof CompensationSubStage[keyof typeof CompensationSubStage]
  | typeof OfferSubStage[keyof typeof OfferSubStage]
  | typeof InReviewSubStage[keyof typeof InReviewSubStage]
  | typeof ShortlistedSubStage[keyof typeof ShortlistedSubStage];

export const STAGE_SUB_STAGES: Record<ATSStage, Array<{ key: string; label: string }>> = {
  [ATSStage.IN_REVIEW]: [
    { key: InReviewSubStage.PROFILE_REVIEW, label: SubStageDisplayNames[InReviewSubStage.PROFILE_REVIEW] },
    { key: InReviewSubStage.PENDING_DECISION, label: SubStageDisplayNames[InReviewSubStage.PENDING_DECISION] }
  ],
  [ATSStage.SHORTLISTED]: [
    { key: ShortlistedSubStage.READY_FOR_INTERVIEW, label: SubStageDisplayNames[ShortlistedSubStage.READY_FOR_INTERVIEW] },
    { key: ShortlistedSubStage.CONTACTED, label: SubStageDisplayNames[ShortlistedSubStage.CONTACTED] },
    { key: ShortlistedSubStage.AWAITING_RESPONSE, label: SubStageDisplayNames[ShortlistedSubStage.AWAITING_RESPONSE] }
  ],
  [ATSStage.INTERVIEW]: [
    { key: InterviewSubStage.NOT_SCHEDULED, label: SubStageDisplayNames[InterviewSubStage.NOT_SCHEDULED] },
    { key: InterviewSubStage.SCHEDULED, label: SubStageDisplayNames[InterviewSubStage.SCHEDULED] },
    { key: InterviewSubStage.COMPLETED, label: SubStageDisplayNames[InterviewSubStage.COMPLETED] },
    { key: InterviewSubStage.EVALUATION_PENDING, label: SubStageDisplayNames[InterviewSubStage.EVALUATION_PENDING] }
  ],
  [ATSStage.TECHNICAL_TASK]: [
    { key: TechnicalTaskSubStage.NOT_ASSIGNED, label: SubStageDisplayNames[TechnicalTaskSubStage.NOT_ASSIGNED] },
    { key: TechnicalTaskSubStage.ASSIGNED, label: SubStageDisplayNames[TechnicalTaskSubStage.ASSIGNED] },
    { key: TechnicalTaskSubStage.SUBMITTED, label: SubStageDisplayNames[TechnicalTaskSubStage.SUBMITTED] },
    { key: TechnicalTaskSubStage.UNDER_REVIEW, label: SubStageDisplayNames[TechnicalTaskSubStage.UNDER_REVIEW] },
    { key: TechnicalTaskSubStage.COMPLETED, label: SubStageDisplayNames[TechnicalTaskSubStage.COMPLETED] }
  ],
  [ATSStage.COMPENSATION]: [
    { key: CompensationSubStage.NOT_INITIATED, label: SubStageDisplayNames[CompensationSubStage.NOT_INITIATED] },
    { key: CompensationSubStage.INITIATED, label: SubStageDisplayNames[CompensationSubStage.INITIATED] },
    { key: CompensationSubStage.NEGOTIATION_ONGOING, label: SubStageDisplayNames[CompensationSubStage.NEGOTIATION_ONGOING] },
    { key: CompensationSubStage.APPROVED, label: SubStageDisplayNames[CompensationSubStage.APPROVED] }
  ],
  [ATSStage.OFFER]: [
    { key: OfferSubStage.NOT_SENT, label: SubStageDisplayNames[OfferSubStage.NOT_SENT] },
    { key: OfferSubStage.OFFER_SENT, label: SubStageDisplayNames[OfferSubStage.OFFER_SENT] },
    { key: OfferSubStage.OFFER_ACCEPTED, label: SubStageDisplayNames[OfferSubStage.OFFER_ACCEPTED] },
    { key: OfferSubStage.OFFER_DECLINED, label: SubStageDisplayNames[OfferSubStage.OFFER_DECLINED] }
  ],
  [ATSStage.HIRED]: []
};

export const STAGE_DESCRIPTIONS: Record<ATSStage, string> = {
  [ATSStage.IN_REVIEW]: 'Initial review of candidate application and qualifications',
  [ATSStage.SHORTLISTED]: 'Candidate has been shortlisted for further evaluation',
  [ATSStage.INTERVIEW]: 'Interview process and evaluation phase',
  [ATSStage.TECHNICAL_TASK]: 'Technical assessment and coding challenge phase',
  [ATSStage.COMPENSATION]: 'Salary negotiation and compensation discussion',
  [ATSStage.OFFER]: 'Final offer stage and onboarding preparation',
  [ATSStage.HIRED]: 'Candidate has been hired for this position'
};

export const STAGE_TAILWIND: Record<ATSStage, { bg: string; bgLight: string; text: string; border: string }> = {
  [ATSStage.IN_REVIEW]: {
    bg: 'bg-gray-500',
    bgLight: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200'
  },
  [ATSStage.SHORTLISTED]: {
    bg: 'bg-blue-500',
    bgLight: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200'
  },
  [ATSStage.INTERVIEW]: {
    bg: 'bg-purple-500',
    bgLight: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200'
  },
  [ATSStage.TECHNICAL_TASK]: {
    bg: 'bg-pink-500',
    bgLight: 'bg-pink-50',
    text: 'text-pink-700',
    border: 'border-pink-200'
  },
  [ATSStage.COMPENSATION]: {
    bg: 'bg-amber-500',
    bgLight: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200'
  },
  [ATSStage.OFFER]: {
    bg: 'bg-green-500',
    bgLight: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200'
  },
  [ATSStage.HIRED]: {
    bg: 'bg-emerald-600',
    bgLight: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200'
  }
};

export const STAGE_COLORS: Record<ATSStage, string> = {
  [ATSStage.IN_REVIEW]: '#6B7280',
  [ATSStage.SHORTLISTED]: '#3B82F6',
  [ATSStage.INTERVIEW]: '#8B5CF6',
  [ATSStage.TECHNICAL_TASK]: '#EC4899',
  [ATSStage.COMPENSATION]: '#F59E0B',
  [ATSStage.OFFER]: '#10B981',
  [ATSStage.HIRED]: '#059669'
};

export const ActivityType = {
  STAGE_CHANGE: 'STAGE_CHANGE',
  SUBSTAGE_CHANGE: 'SUBSTAGE_CHANGE',
  INTERVIEW_SCHEDULED: 'INTERVIEW_SCHEDULED',
  INTERVIEW_COMPLETED: 'INTERVIEW_COMPLETED',
  INTERVIEW_CANCELLED: 'INTERVIEW_CANCELLED',
  TASK_ASSIGNED: 'TASK_ASSIGNED',
  TASK_SUBMITTED: 'TASK_SUBMITTED',
  TASK_COMPLETED: 'TASK_COMPLETED',
  COMPENSATION_INITIATED: 'COMPENSATION_INITIATED',
  COMPENSATION_UPDATED: 'COMPENSATION_UPDATED',
  COMPENSATION_APPROVED: 'COMPENSATION_APPROVED',
  COMPENSATION_MEETING_SCHEDULED: 'COMPENSATION_MEETING_SCHEDULED',
  OFFER_SENT: 'OFFER_SENT',
  OFFER_ACCEPTED: 'OFFER_ACCEPTED',
  OFFER_DECLINED: 'OFFER_DECLINED',
  COMMENT_ADDED: 'COMMENT_ADDED',
  NOTE_ADDED: 'NOTE_ADDED'
} as const;

export type ActivityType = typeof ActivityType[keyof typeof ActivityType];
