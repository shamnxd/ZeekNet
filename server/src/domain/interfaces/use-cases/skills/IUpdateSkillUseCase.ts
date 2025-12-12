import { Skill } from 'src/domain/entities/skill.entity';

export interface IUpdateSkillUseCase {
  execute(skillId: string, name: string): Promise<Skill>;
}
