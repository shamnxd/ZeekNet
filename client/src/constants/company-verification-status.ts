export const CompanyVerificationStatus = {
  PENDING: 'pending',
  REJECTED: 'rejected',
  VERIFIED: 'verified',
} as const;

export type CompanyVerificationStatus = typeof CompanyVerificationStatus[keyof typeof CompanyVerificationStatus];
