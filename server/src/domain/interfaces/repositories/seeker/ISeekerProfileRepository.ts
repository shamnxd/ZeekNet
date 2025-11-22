import { SeekerProfile } from '../../../entities/seeker-profile.entity';
import { IBaseRepository } from '../IBaseRepository';

export interface ISeekerProfileRepository extends IBaseRepository<SeekerProfile> {
  // Use findOne({ userId }) and exists({ userId }) from base instead
}