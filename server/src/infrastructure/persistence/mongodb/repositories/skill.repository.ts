import { ISkillRepository, SkillQueryFilters, PaginatedSkills } from 'src/domain/interfaces/repositories/skill/ISkillRepository';
import { Skill } from 'src/domain/entities/skill.entity';
import { SkillModel, SkillDocument as ModelDocument } from 'src/infrastructure/persistence/mongodb/models/skill.model';
import { SkillMapper } from 'src/infrastructure/mappers/persistence/mongodb/skill/skill.mapper';
import { RepositoryBase } from 'src/infrastructure/persistence/mongodb/repositories/base-repository';

export class SkillRepository extends RepositoryBase<Skill, ModelDocument> implements ISkillRepository {
  constructor() {
    super(SkillModel);
  }

  protected mapToEntity(doc: ModelDocument): Skill {
    return SkillMapper.toEntity(doc);
  }

  protected mapToDocument(entity: Partial<Skill>): Partial<ModelDocument> {
    return SkillMapper.toDocument(entity as Skill);
  }

  async findByName(name: string): Promise<Skill | null> {
    const escapedName = name.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const doc = await this.model.findOne({ 
      name: { $regex: new RegExp(`^${escapedName}$`, 'i') }, 
    }).exec();
    return doc ? this.mapToEntity(doc) : null;
  }
}

