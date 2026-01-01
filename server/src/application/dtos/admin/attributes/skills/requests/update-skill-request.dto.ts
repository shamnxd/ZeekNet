import { z } from 'zod';

export const UpdateSkillRequestDtoSchema = z.object({
  skillId: z.string().min(1, 'Skill ID is required'),
  name: z.string().min(1, 'Skill name is required').max(100, 'Skill name must be less than 100 characters').trim(),
});

export type UpdateSkillRequestDto = z.infer<typeof UpdateSkillRequestDtoSchema>;


export const UpdateSkillDto = UpdateSkillRequestDtoSchema;

