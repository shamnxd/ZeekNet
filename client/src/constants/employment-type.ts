export const EmploymentType = {
  FULL_TIME: 'full-time',
  PART_TIME: 'part-time',
  CONTRACT: 'contract',
  INTERNSHIP: 'internship',
  REMOTE: 'remote',
} as const;

export type EmploymentType = typeof EmploymentType[keyof typeof EmploymentType];
