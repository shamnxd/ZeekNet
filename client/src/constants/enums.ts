export const UserRole = {
  SEEKER: 'seeker',
  COMPANY: 'company',
  ADMIN: 'admin',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const ApplicationStage = {
  APPLIED: 'applied',
  SHORTLISTED: 'shortlisted',
  INTERVIEW: 'interview',
  REJECTED: 'rejected',
  HIRED: 'hired',
} as const;

export type ApplicationStage = typeof ApplicationStage[keyof typeof ApplicationStage];