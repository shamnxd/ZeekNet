import { z } from 'zod';

export const UpdateJobRoleRequestDtoSchema = z.object({
  jobRoleId: z.string().min(1, 'Job role ID is required'),
  name: z.string().min(1, 'Job role name is required').max(100, 'Job role name must be less than 100 characters').trim(),
});

export type UpdateJobRoleRequestDto = z.infer<typeof UpdateJobRoleRequestDtoSchema>;

// Export for router validation
export const UpdateJobRoleDto = UpdateJobRoleRequestDtoSchema;

