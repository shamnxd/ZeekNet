import { ISeekerEducationRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerEducationRepository';
import { Education } from 'src/domain/entities/seeker-profile.entity';
import { SeekerEducationModel, SeekerEducationDocument } from 'src/infrastructure/persistence/mongodb/models/seeker-education.model';
import { Types } from 'mongoose';
import { RepositoryBase } from 'src/infrastructure/persistence/mongodb/repositories/base-repository';
import { SeekerEducationMapper } from 'src/infrastructure/mappers/persistence/mongodb/seeker/seeker-education.mapper';


export class SeekerEducationRepository extends RepositoryBase<Education, SeekerEducationDocument> implements ISeekerEducationRepository {
  constructor() {
    super(SeekerEducationModel);
  }

  protected mapToEntity(doc: SeekerEducationDocument): Education {
    return SeekerEducationMapper.toEntity(doc);
  }

  protected mapToDocument(entity: Partial<Education>): Partial<SeekerEducationDocument> {
    return SeekerEducationMapper.toDocument(entity);
  }

  async createForProfile(seekerProfileId: string, education: Omit<Education, 'id'>): Promise<Education> {
    const educationDoc = new SeekerEducationModel({
      ...this.mapToDocument(education as Education),
      seekerProfileId: new Types.ObjectId(seekerProfileId),
    });
    
    await educationDoc.save();
    return this.mapToEntity(educationDoc);
  }

  async findBySeekerProfileId(seekerProfileId: string): Promise<Education[]> {
    const docs = await SeekerEducationModel.find({ 
      seekerProfileId: new Types.ObjectId(seekerProfileId), 
    }).sort({ startDate: -1 });
    
    return docs.map(doc => this.mapToEntity(doc));
  }
}

