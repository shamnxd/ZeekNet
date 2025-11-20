import { Education } from '../../../entities/seeker-profile.entity';
import { IBaseRepository } from '../IBaseRepository';

export interface ISeekerEducationRepository extends IBaseRepository<Education> {
  createForProfile(seekerProfileId: string, education: Omit<Education, 'id'>): Promise<Education>;
  findBySeekerProfileId(seekerProfileId: string): Promise<Education[]>;
}