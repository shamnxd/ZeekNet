import { z } from 'zod';

export const UpdateSkillsRequestDtoSchema = z.object({
  skills: z.array(z.string()).min(0, 'Skills must be an array'),
});

export type UpdateSkillsRequestDto = z.infer<typeof UpdateSkillsRequestDtoSchema>;

// Export for controller validation
export const UpdateSkillsDto = UpdateSkillsRequestDtoSchema;

