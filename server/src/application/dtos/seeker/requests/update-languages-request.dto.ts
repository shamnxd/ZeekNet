import { z } from 'zod';

export const UpdateLanguagesRequestDtoSchema = z.object({
  languages: z.array(z.string()).min(0, 'Languages must be an array'),
});

export type UpdateLanguagesRequestDto = z.infer<typeof UpdateLanguagesRequestDtoSchema>;


export const UpdateLanguagesDto = UpdateLanguagesRequestDtoSchema;

