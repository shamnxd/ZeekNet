import { z } from 'zod';

export const UpdateSkillsRequestDtoSchema = z.object({
  skills: z.array(z.string()).min(0, 'Skills must be an array'),
});

export type UpdateSkillsRequestDto = z.infer<typeof UpdateSkillsRequestDtoSchema>;


export const UpdateSkillsDto = UpdateSkillsRequestDtoSchema;

