import { Skill } from 'src/domain/entities/skill.entity';

export interface IGetSkillByIdUseCase {
  execute(skillId: string): Promise<Skill>;
}
