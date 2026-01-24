import { z } from 'zod';

export const GetCandidatesDto = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().optional(),
    location: z.string().optional(),
    skills: z.string().transform((val) => val.split(',')).optional(),
});

export type GetCandidatesRequestDto = z.infer<typeof GetCandidatesDto>;


