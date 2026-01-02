import { Skill } from 'src/domain/entities/skill.entity';

export interface ICreateSkillUseCase {
  execute(name: string): Promise<Skill>;
}
