import { z } from 'zod';
export const ParamsWithIdDto = z.object({
  id: z.string().min(1, 'ID is required'),
});
export type ParamsWithIdDto = z.infer<typeof ParamsWithIdDto>;