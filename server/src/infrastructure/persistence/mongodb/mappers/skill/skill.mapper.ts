import { Skill } from '../../../../../domain/entities/skill.entity';
import { SkillDocument } from '../../models/skill.model';

export class SkillMapper {
  static toEntity(doc: SkillDocument): Skill {
    return Skill.create({
      id: String(doc._id),
      name: doc.name,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toDocument(entity: Skill): Partial<SkillDocument> {
    return {
      name: entity.name,
    };
  }
}

