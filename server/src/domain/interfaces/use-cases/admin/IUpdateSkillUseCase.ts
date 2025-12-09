import { UpdateSkillRequestDto } from 'src/application/dto/admin/skill-management.dto';
import { Skill } from 'src/domain/entities/skill.entity';

export interface IUpdateSkillUseCase {
  execute(data: UpdateSkillRequestDto): Promise<Skill>;
}
