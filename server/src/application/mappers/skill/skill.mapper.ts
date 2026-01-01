import { Skill } from 'src/domain/entities/skill.entity';

export interface SkillResponseDto {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

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

