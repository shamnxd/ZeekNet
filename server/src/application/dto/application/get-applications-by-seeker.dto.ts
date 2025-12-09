import { z } from 'zod';

export const GetApplicationsBySeekerDto = z.object({
  seekerId: z.string().optional(),
  stage: z.enum(['applied', 'shortlisted', 'interview', 'rejected', 'hired']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type GetApplicationsBySeekerRequestDto = z.infer<typeof GetApplicationsBySeekerDto>;
