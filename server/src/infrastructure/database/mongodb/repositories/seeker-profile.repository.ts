import { ISeekerProfileRepository } from '../../../../domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { SeekerProfile } from '../../../../domain/entities/seeker-profile.entity';
import { SeekerProfileModel, SeekerProfileDocument as ModelDocument } from '../models/seeker-profile.model';
import { RepositoryBase } from './base-repository';
import { SeekerProfileMapper } from '../mappers/seeker-profile.mapper';

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
}