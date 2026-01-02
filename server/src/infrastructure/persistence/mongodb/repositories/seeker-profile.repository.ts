import { PipelineStage } from 'mongoose';
import { ISeekerProfileRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { SeekerProfile } from 'src/domain/entities/seeker-profile.entity';
import { SeekerProfileModel, SeekerProfileDocument as ModelDocument } from 'src/infrastructure/persistence/mongodb/models/seeker-profile.model';
import { RepositoryBase } from 'src/infrastructure/persistence/mongodb/repositories/base-repository';
import { SeekerProfileMapper } from 'src/infrastructure/mappers/persistence/mongodb/seeker/seeker-profile.mapper';

export class SeekerProfileRepository extends RepositoryBase<SeekerProfile, ModelDocument> implements ISeekerProfileRepository {
  constructor() {
    super(SeekerProfileModel);
  }

  protected mapToEntity(doc: ModelDocument): SeekerProfile {
    return SeekerProfileMapper.toEntity(doc);
  }

  protected mapToDocument(entity: Partial<SeekerProfile>): Partial<ModelDocument> {
    return SeekerProfileMapper.toDocument(entity);
  }

  async getAll(options: {
    page: number;
    limit: number;
    search?: string;
    skills?: string[];
    location?: string;
  }): Promise<{ seekers: (SeekerProfile & { user: { name: string; email: string; _id: string } })[]; total: number }> {
    const { page, limit, search, skills, location } = options;
    const skip = (page - 1) * limit;

    const pipeline: PipelineStage[] = [];

    pipeline.push({
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    });

    pipeline.push({ $unwind: '$user' });

    const match: Record<string, unknown> = {};

    if (search) {
      match.$or = [
        { headline: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
        { 'user.name': { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } },
      ];
    }
    
    if (skills && skills.length > 0) {
      match.skills = { $in: skills.map(s => new RegExp(s, 'i')) };
    }

    if (location) {
      match.location = { $regex: location, $options: 'i' };
    }

    if (Object.keys(match).length > 0) {
      pipeline.push({ $match: match });
    }

    const facetStage = {
      $facet: {
        docs: [
          { $skip: skip },
          { $limit: limit },
        ],
        totalCount: [
          { $count: 'count' },
        ],
      },
    };
    pipeline.push(facetStage);

    const result = await SeekerProfileModel.aggregate(pipeline);
    
    const docs = result[0].docs;
    const total = result[0].totalCount[0] ? result[0].totalCount[0].count : 0;

    const seekers = docs.map((doc: ModelDocument & { user: { name: string; email: string; _id: unknown } }) => {
      const entity = this.mapToEntity(doc);
      return {
        ...entity,
         
        user: {
          name: doc.user.name,
          email: doc.user.email,
          _id: String(doc.user._id),
        },
      };
    });

    return { seekers, total };
  }

  async countTotal(): Promise<number> {
    return SeekerProfileModel.countDocuments();
  }
}

