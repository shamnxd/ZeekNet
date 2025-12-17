export const ApplicationStage = {
  APPLIED: 'applied',
  SHORTLISTED: 'shortlisted',
  INTERVIEW: 'interview',
  REJECTED: 'rejected',
  HIRED: 'hired',
} as const;

export type ApplicationStage = typeof ApplicationStage[keyof typeof ApplicationStage];
