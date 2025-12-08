import { z } from 'zod';

export const ApplicationFiltersDto = z.object({
  job_id: z.string().optional(),
  stage: z.enum(['applied', 'shortlisted', 'interview', 'rejected', 'hired']).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

