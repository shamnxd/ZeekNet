import { ISeekerEducationRepository } from '../../../../domain/interfaces/repositories/seeker/ISeekerEducationRepository';
import { Education } from '../../../../domain/entities/seeker-profile.entity';
import { SeekerEducationModel, SeekerEducationDocument } from '../models/seeker-education.model';
import { Types } from 'mongoose';

export class SeekerEducationRepository implements ISeekerEducationRepository {
  constructor() {}

  async createForProfile(seekerProfileId: string, education: Omit<Education, 'id'>): Promise<Education> {
    const educationDoc = new SeekerEducationModel({
      ...education,
      seekerProfileId: new Types.ObjectId(seekerProfileId),
    });
    
    await educationDoc.save();
    return this.mapToEntity(educationDoc);
  }

  async findById(id: string): Promise<Education | null> {
    const doc = await SeekerEducationModel.findById(id);
    return doc ? this.mapToEntity(doc) : null;
  }

  async findMany(filter: Record<string, unknown>): Promise<Education[]> {
    const docs = await SeekerEducationModel.find(filter);
    return docs.map(doc => this.mapToEntity(doc));
  }

  async update(id: string, data: Partial<Education>): Promise<Education | null> {
    const doc = await SeekerEducationModel.findByIdAndUpdate(id, data, { new: true });
    return doc ? this.mapToEntity(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await SeekerEducationModel.findByIdAndDelete(id);
    return !!result;
  }

  private mapToEntity(doc: SeekerEducationDocument): Education {
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
}