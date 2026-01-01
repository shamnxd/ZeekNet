import { z } from 'zod';

export const CreateSkillRequestDtoSchema = z.object({
  name: z.string().min(1, 'Skill name is required').max(100, 'Skill name must be less than 100 characters').trim(),
});

export type CreateSkillRequestDto = z.infer<typeof CreateSkillRequestDtoSchema>;


export const CreateSkillDto = CreateSkillRequestDtoSchema;

