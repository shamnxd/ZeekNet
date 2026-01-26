import { Skill } from 'src/domain/entities/skill.entity';
import { SkillResponseDto } from 'src/application/dtos/admin/attributes/skills/responses/skill-response.dto';

export class SkillMapper {
  static toResponse(skill: Skill): SkillResponseDto {
    return {
      id: skill.id,
      name: skill.name,
      createdAt: skill.createdAt,
      updatedAt: skill.updatedAt,
    };
  }

  static toResponseList(skills: Skill[]): SkillResponseDto[] {
    return skills.map((skill) => this.toResponse(skill));
  }
}

