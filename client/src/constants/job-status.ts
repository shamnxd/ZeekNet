export const JobStatus = {
  ACTIVE: 'active',
  UNLISTED: 'unlisted',
  EXPIRED: 'expired',
  BLOCKED: 'blocked',
} as const;

export type JobStatus = typeof JobStatus[keyof typeof JobStatus];
