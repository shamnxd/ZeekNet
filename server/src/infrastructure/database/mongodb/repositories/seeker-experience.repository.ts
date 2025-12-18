import { ISeekerExperienceRepository } from '../../../../domain/interfaces/repositories/seeker/ISeekerExperienceRepository';
import { Experience } from '../../../../domain/entities/seeker-profile.entity';
import { SeekerExperienceModel, SeekerExperienceDocument } from '../models/seeker-experience.model';
import { Types } from 'mongoose';
import { RepositoryBase } from './base-repository';
import { SeekerExperienceMapper } from '../mappers/seeker-experience.mapper';


export class SeekerExperienceRepository extends RepositoryBase<Experience, SeekerExperienceDocument> implements ISeekerExperienceRepository {
  constructor() {
    super(SeekerExperienceModel);
  }

  protected mapToEntity(doc: SeekerExperienceDocument): Experience {
    return SeekerExperienceMapper.toEntity(doc);
  }

  protected mapToDocument(entity: Partial<Experience>): Partial<SeekerExperienceDocument> {
    return SeekerExperienceMapper.toDocument(entity);
  }

  async createForProfile(seekerProfileId: string, experience: Omit<Experience, 'id'>): Promise<Experience> {
    const experienceDoc = new SeekerExperienceModel({
      ...this.mapToDocument(experience as Experience),
      seekerProfileId: new Types.ObjectId(seekerProfileId),
    });
    
    await experienceDoc.save();
    return this.mapToEntity(experienceDoc);
  }

  async findBySeekerProfileId(seekerProfileId: string): Promise<Experience[]> {
    const docs = await SeekerExperienceModel.find({ 
      seekerProfileId: new Types.ObjectId(seekerProfileId), 
    }).sort({ startDate: -1 });
    
    return docs.map(doc => this.mapToEntity(doc));
  }
}