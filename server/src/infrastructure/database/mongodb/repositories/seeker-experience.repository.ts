import { ISeekerExperienceRepository } from '../../../../domain/interfaces/repositories/seeker/ISeekerExperienceRepository';
import { Experience } from '../../../../domain/entities/seeker-profile.entity';
import { SeekerExperienceModel, SeekerExperienceDocument } from '../models/seeker-experience.model';
import { Types } from 'mongoose';

export class SeekerExperienceRepository implements ISeekerExperienceRepository {
  constructor() {}

  async createForProfile(seekerProfileId: string, experience: Omit<Experience, 'id'>): Promise<Experience> {
    const experienceDoc = new SeekerExperienceModel({
      ...experience,
      seekerProfileId: new Types.ObjectId(seekerProfileId),
    });
    
    await experienceDoc.save();
    return this.mapToEntity(experienceDoc);
  }

  async findById(id: string): Promise<Experience | null> {
    const doc = await SeekerExperienceModel.findById(id);
    return doc ? this.mapToEntity(doc) : null;
  }

  async findMany(filter: Record<string, unknown>): Promise<Experience[]> {
    const docs = await SeekerExperienceModel.find(filter);
    return docs.map(doc => this.mapToEntity(doc));
  }

  async update(id: string, data: Partial<Experience>): Promise<Experience | null> {
    const doc = await SeekerExperienceModel.findByIdAndUpdate(id, data, { new: true });
    return doc ? this.mapToEntity(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await SeekerExperienceModel.findByIdAndDelete(id);
    return !!result;
  }

  private mapToEntity(doc: SeekerExperienceDocument): Experience {
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
}