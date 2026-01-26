import { z } from 'zod';

export const GetCandidateDetailsDto = z.object({
  id: z.string().min(1, 'Candidate ID is required'),
});

export type GetCandidateDetailsRequestDto = z.infer<typeof GetCandidateDetailsDto>;
