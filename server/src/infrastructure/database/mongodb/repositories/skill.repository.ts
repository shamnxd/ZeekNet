import { ISkillRepository, SkillQueryFilters, PaginatedSkills } from '../../../../domain/interfaces/repositories/skill/ISkillRepository';
import { Skill } from '../../../../domain/entities/skill.entity';
import { SkillModel, SkillDocument as ModelDocument } from '../models/skill.model';
import { SkillMapper, SkillDocument } from '../mappers/skill.mapper';
import { RepositoryBase } from './base-repository';

export class SkillRepository extends RepositoryBase<Skill, SkillDocument> implements ISkillRepository {
  constructor() {
    super(SkillModel);
  }

  protected mapToEntity(doc: ModelDocument): Skill {
    return SkillMapper.toEntity(doc as unknown as SkillDocument);
  }

  // Keep findByName - it has special regex logic for case-insensitive exact match
  async findByName(name: string): Promise<Skill | null> {
    const escapedName = name.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const doc = await this.model.findOne({ 
      name: { $regex: new RegExp(`^${escapedName}$`, 'i') }, 
    }).exec();
    return doc ? this.mapToEntity(doc) : null;
  }

  async findAllWithPagination(filters?: SkillQueryFilters): Promise<PaginatedSkills> {
    return await this.paginate<PaginatedSkills>({
      page: filters?.page,
      limit: filters?.limit,
      search: filters?.search,
      searchField: 'name',
      sortBy: filters?.sortBy || 'name',
      sortOrder: filters?.sortOrder || 'asc',
      resultKey: 'skills',
    });
  }
}