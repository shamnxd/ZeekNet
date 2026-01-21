import { z } from 'zod';

export const GetActivitiesQueryDtoSchema = z.object({
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
    cursor: z.string().optional(),
});

export type GetActivitiesQueryDto = z.infer<typeof GetActivitiesQueryDtoSchema>;
