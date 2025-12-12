import { z } from 'zod';

export const CreateJobRoleRequestDtoSchema = z.object({
  name: z.string().min(1, 'Job role name is required').max(100, 'Job role name must be less than 100 characters').trim(),
});

export type CreateJobRoleRequestDto = z.infer<typeof CreateJobRoleRequestDtoSchema>;

// Export for router validation
export const CreateJobRoleDto = CreateJobRoleRequestDtoSchema;

