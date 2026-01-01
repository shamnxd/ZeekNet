import { Experience } from 'src/domain/entities/seeker-profile.entity';
import { SeekerExperienceDocument } from 'src/infrastructure/persistence/mongodb/models/seeker-experience.model';
import { Types } from 'mongoose';

export class SeekerExperienceMapper {
  static toEntity(doc: SeekerExperienceDocument): Experience {
    return {
      id: String(doc._id),
      title: doc.title,
      company: doc.company,
      startDate: doc.startDate,
      endDate: doc.endDate,
      employmentType: doc.employmentType,
      location: doc.location,
      description: doc.description,
      technologies: doc.technologies || [],
      isCurrent: doc.isCurrent,
    };
  }

  static toDocument(entity: Partial<Experience>): Partial<SeekerExperienceDocument> {
    const doc: Partial<SeekerExperienceDocument> = {};

    if (entity.title !== undefined) doc.title = entity.title;
    if (entity.company !== undefined) doc.company = entity.company;
    if (entity.startDate !== undefined) doc.startDate = entity.startDate;
    if (entity.endDate !== undefined) doc.endDate = entity.endDate;
    if (entity.employmentType !== undefined) doc.employmentType = entity.employmentType;
    if (entity.location !== undefined) doc.location = entity.location;
    if (entity.description !== undefined) doc.description = entity.description;
    if (entity.technologies !== undefined) doc.technologies = entity.technologies;
    if (entity.isCurrent !== undefined) doc.isCurrent = entity.isCurrent;

    return doc;
  }
}

