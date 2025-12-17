export const UserRole = {
  SEEKER: 'seeker',
  COMPANY: 'company',
  ADMIN: 'admin',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];
