import { Education } from '../../../../domain/entities/seeker-profile.entity';
import { SeekerEducationDocument } from '../models/seeker-education.model';
import { Types } from 'mongoose';

export class SeekerEducationMapper {
  static toEntity(doc: SeekerEducationDocument): Education {
    return {
      id: String(doc._id),
      school: doc.school,
      degree: doc.degree,
      fieldOfStudy: doc.fieldOfStudy,
      startDate: doc.startDate,
      endDate: doc.endDate,
      grade: doc.grade,
    };
  }

  static toDocument(entity: Partial<Education>): Partial<SeekerEducationDocument> {
    const doc: Partial<SeekerEducationDocument> = {};

    if (entity.school !== undefined) doc.school = entity.school;
    if (entity.degree !== undefined) doc.degree = entity.degree;
    if (entity.fieldOfStudy !== undefined) doc.fieldOfStudy = entity.fieldOfStudy;
    if (entity.startDate !== undefined) doc.startDate = entity.startDate;
    if (entity.endDate !== undefined) doc.endDate = entity.endDate;
    if (entity.grade !== undefined) doc.grade = entity.grade;

    return doc;
  }
}
